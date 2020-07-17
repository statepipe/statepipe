import utils from "./utils";

const getPayload = (schema, event) => (acc, reducer) => {
  
  if (utils.validateState(acc)
    && utils.validateState(reducer)
    && typeof reducer.run === "function")
  {
    const prefix = `:statepipe ${schema.wrapper}: ${schema.type}/ ${schema.node.nodeName}`;
    try {
        const fn = reducer.run.apply(null, reducer.args);
        if (typeof fn === "function"){
          acc = fn(acc, event, schema.node);
          utils.log(`${prefix} (${reducer.index}) > ${reducer.fn}(${(reducer.args||[]).join(",")}) partial payload:`, acc);
        } else {
          utils.log(`${prefix} (${reducer.index}) > ${reducer.fn}(${(reducer.args||[]).join(",")}) reducer is not a function!`,acc);
        }
    } catch (err){
      utils.warn(`${prefix} ${reducer.fn}(${reducer.args.join(",")}) error:`, err);
      acc = null;
    }
  }
  return acc;
};

export default (schema, action) => {
  if (!utils.validateState(schema)
    || !utils.validateNode(schema.node)
    || !utils.validateProp(action)){
    return null;
  }
  return event => {
    //update reducers list with only items with valid store
    schema.reducers = schema.reducers
      .filter(utils.getStoreRunner(schema.type));

    const oldstate = utils.parseJSON(schema.node);
    if (!utils.validateState(oldstate)) {
      return schema;
    }

    const resolveTrigger = (block, value) => {
      if (utils.validateState(value)&& Object.keys(value).length) {
        utils.log(`:statepipe ${schema.wrapper}: ${schema.type}/ ${schema.node.nodeName} (${block}) ∴ action=${action} payload`, value);
        schema.node.setAttribute(utils.PAYLOAD_ATTR, JSON.stringify(value));
        schema.node.setAttribute(utils.ACTION_ATTR, action);
      } else {
        utils.log(`:statepipe ${schema.wrapper}: ${schema.type}/ ${schema.node.nodeName} (${block}) ∴ action ${action} wont be fired!`);
      }
    };

    let index;
    const payload = schema.reducers
      .filter(item => utils.validateProp(action) && action === item.action)
      .filter(item => item.event === (event || {}).type && item.event !== undefined)
      .reduce((acc, reducer) => {
        if (index !== reducer.index){
          if (index !== undefined){
            //resolve prev blocks action
            resolveTrigger(index, acc);
          }
          index = reducer.index;
          acc = oldstate;
        }
        return getPayload(schema, event)(acc, reducer);
      }, oldstate);
      
      if (schema.reducers.length){
        //resolve last blocks action
        const lastIndex = schema.reducers[schema.reducers.length-1].index;
        resolveTrigger(lastIndex, payload);
      }
    
    return schema;
  };
};
