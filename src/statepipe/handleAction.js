import utils from "~/src/statepipe/utils";

export default (action, payload, origin) => {
  
  if (!utils.validateState(payload)
  || !utils.validateNode(origin) 
  || !utils.validateProp((origin||{}).statepipe)
  || !utils.validateProp(action)){
    return null;
  }
  
  return schema => {
    if (!utils.validateState(schema)
    || !utils.validateNode(schema.node)
    || !utils.PIPE_STORE === schema.type){
      return null;
    }
    
    const prefix = `:statepipe ${schema.node.statepipe}: ${schema.type}/ ${schema.node.nodeName}`;
    const currentState = utils.parseJSON(schema.node);
    
    const resolveAction = (block, newState) => {
      if (!utils.validateState(newState)) {
        utils.log(`${prefix} (${block}) ∴ no state changes!`);
        return;
      }

      const sNState = JSON.stringify(newState);
      const sState = JSON.stringify(currentState);
      
      if (utils.validateProp(sNState)
      && utils.validateProp(sState)
      && sNState !== sState
      ) {
        schema.node.setAttribute(utils.STATE_ATTR, sNState);
        utils.log(`${prefix} (${block}) ∴ state`,sNState);
      } else {
        utils.log(`${prefix} (${block}) ∴ no state changes!`);
      }
    };
    
    if (!utils.validateState(currentState)){
      return null;
    }
    
    let newState, index;
    
    try {
      schema.reducers = schema.reducers
      .filter(utils.getStoreRunner(schema.type));
      
      newState = schema.reducers
      .reduce((acc, reducer) => {
        if (index !== reducer.index){
          if (index !== undefined){
            //resolve prev blocks action
            resolveAction(index, acc);
          }
          index = reducer.index;
          acc = currentState;
        }
        if (utils.validateState(acc)){
          const fn = reducer.run.apply(reducer, reducer.args);
          if (typeof fn === "function"){
            acc = fn(payload, acc, action, schema.node, origin);
            utils.log(`${prefix} (${reducer.index}) > ${reducer.fn}(${(reducer.args||[]).join(",")}) payload`,payload,"state",acc,"action: "+action);
          } else {
            utils.log(`${prefix} (${reducer.index}) > ${reducer.fn}(${(reducer.args||[]).join(",")}) reducer is not a function!`,acc);
          }
        }
        return acc;
      }, currentState);
      
      //resolve last blocks action
      if (schema.reducers.length){
        const lastIndex = schema.reducers[schema.reducers.length-1].index;
        resolveAction(lastIndex, newState);
      }
      
    } catch (err) {
      utils.warn(`${prefix} > error running reducers!`, err);
    } 
    return schema;
  };
};
