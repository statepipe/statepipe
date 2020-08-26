export const STATEPIPE_ATTR = ":statepipe";
export const STATE_ATTR = ":state";
export const PIPE_ATTR = ":pipe";
export const TRIGGER_ATTR = ":trigger";
export const OUT_ATTR = ":out";
export const PAYLOAD_ATTR = ":payload";
export const ACTION_ATTR = ":action";

export const OUT_STORE = "out";
export const PIPE_STORE = "pipe";
export const TRIGGER_STORE = "trigger";

export const QUERY_COMPONENTS = `[\\${TRIGGER_ATTR}],[\\${PIPE_ATTR}],[\\${OUT_ATTR}]`;
export const QUERY_STATEPIPE = `[\\${STATEPIPE_ATTR}]`;
export const COMPONENT_ATTR_LIST = [OUT_ATTR,PIPE_ATTR,TRIGGER_ATTR];

export const ALIAS_STORES = {
  [PIPE_ATTR]:PIPE_STORE,
  [OUT_ATTR]:OUT_STORE,
  [TRIGGER_ATTR]:TRIGGER_STORE
};

export const ALIAS_ATTR = {
  [PIPE_STORE]:PIPE_ATTR,
  [OUT_STORE]:OUT_ATTR,
  [TRIGGER_STORE]:TRIGGER_ATTR
};

export const validateProp = prop => !!(typeof prop === "string" && prop.trim().length > 0);
export const validateState = state => !!(!!state && typeof state === "object" && Array.isArray(state) === false);
export const validateNode = node => !!(validateState(node) && !!node.parentNode && node.nodeName && typeof node.addEventListener === "function" && typeof node.setAttribute === "function");
export const validateStoreAttrName = attr => !!([TRIGGER_STORE, OUT_STORE, PIPE_STORE].indexOf(attr) !== -1);

export const log = (...args) => {
  if (global.$statepipeLog) {
    console.log.call(console.log, ...args);
  }  
};

export const warn = (...args) => {
  if (global.$statepipeLog) {
    console.warn.call(console.warn, ...args);
  }  
};

export const error = (...args) => {
  if (global.$statepipeLog) {
    console.error.call(console.error, ...args);
  }  
};


export const parseJSON = (node, prop) => {
  prop = prop || STATE_ATTR;

  if (validateNode(node) && validateProp(prop)){
    try {
      const json = JSON.parse(node.getAttribute(prop));
      return validateState(json)? json : null;
    } catch(e) { 
      return null;
    }
  }
  return null;
};

export const flatten = (acc,list) => {
  if (Array.isArray(acc) && Array.isArray(list)){
    acc = acc.concat(list);
  }
  return acc;
};

export const getStatepipeName = node => {
  if (validateNode(node)){
    const name = node.getAttribute(STATEPIPE_ATTR);
    if (name && name.length) return name;
    return null;
  }
  return null;
};

export const testSchema = node => {
  if (validateNode(node)){
    return COMPONENT_ATTR_LIST.map(type => {
      if (validateProp(node.getAttribute(type))){
        return {type: ALIAS_STORES[type], node};
      }
    }).filter(schema => schema);
  }
  return null;
};

export const queryComponents = (node, statepipeInstance) => {
  if (validateNode(node)){
    const candaidates = Array.from(node.querySelectorAll(QUERY_COMPONENTS));
    return [node]
      .concat(candaidates)
      .map(testSchema)
      .filter(schema => schema)
      .reduce(flatten, [])
      .filter(schema => !schema.wrapper)
      .filter(schema => {
        if (schema.node.statepipe){
          return null;
        }
        return schema;
      })
      .map(schema => {
        schema.parent = statepipeInstance;
        schema.node.statepipe = statepipeInstance;
        schema.wrapper = node;
        return schema;
      });
  }
  return null;
};

export const getStoreRunner = type => reducer => {
  if (validateState(reducer)
  && validateState(reducer.store)
  && validateProp(type)
  && validateProp(reducer.fn)
  && validateState(reducer.store[type])
  && typeof reducer.store[type][reducer.fn] === "function"){
    reducer.run = reducer.store[type][reducer.fn];
    return reducer;
  }
  return null;
};

export default {
  log,
  warn,
  error,
  flatten,
  parseJSON,
  validateProp,
  validateState,
  validateNode,
  validateStoreAttrName,
  getStatepipeName,
  getStoreRunner,
  queryComponents,
  QUERY_STATEPIPE,
  ALIAS_STORES,
  ALIAS_ATTR,
  OUT_ATTR,
  OUT_STORE,
  PIPE_ATTR,
  PIPE_STORE,
  TRIGGER_ATTR,
  TRIGGER_STORE,
  STATE_ATTR,
  STATEPIPE_ATTR,
  COMPONENT_ATTR_LIST,
  PAYLOAD_ATTR,
  ACTION_ATTR
};
