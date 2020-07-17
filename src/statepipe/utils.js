const STATEPIPE_ATTR = ":statepipe";
const STATE_ATTR = ":state";
const PIPE_ATTR = ":pipe";
const TRIGGER_ATTR = ":trigger";
const OUT_ATTR = ":out";
const PAYLOAD_ATTR = ":payload";
const ACTION_ATTR = ":action";

const OUT_STORE = "out";
const PIPE_STORE = "pipe";
const TRIGGER_STORE = "trigger";

const QUERY_COMPONENTS = `[\\${TRIGGER_ATTR}],[\\${PIPE_ATTR}],[\\${OUT_ATTR}]`;
const QUERY_STATEPIPE = `[\\${STATEPIPE_ATTR}]`;
const COMPONENT_ATTR_LIST = [OUT_ATTR,PIPE_ATTR,TRIGGER_ATTR];

const ALIAS_STORES = {
  [PIPE_ATTR]:PIPE_STORE,
  [OUT_ATTR]:OUT_STORE,
  [TRIGGER_ATTR]:TRIGGER_STORE
};

const ALIAS_ATTR = {
  [PIPE_STORE]:PIPE_ATTR,
  [OUT_STORE]:OUT_ATTR,
  [TRIGGER_STORE]:TRIGGER_ATTR
};

const validateProp = prop => !!(typeof prop === "string" && prop.trim().length > 0);
const validateState = state => !!(!!state && typeof state === "object" && Array.isArray(state) === false);
const validateNode = node => !!(validateState(node) && !!node.parentNode && node.nodeName && typeof node.addEventListener === "function" && typeof node.setAttribute === "function");
const validateStoreAttrName = attr => !!([TRIGGER_STORE, OUT_STORE, PIPE_STORE].indexOf(attr) !== -1);

const log = (...args) => {
  if (global.$statepipeLog) {
    console.log.call(console.log, ...args);
  }  
};

const warn = (...args) => {
  if (global.$statepipeLog) {
    console.warn.call(console.warn, ...args);
  }  
};

const error = (...args) => {
  if (global.$statepipeLog) {
    console.error.call(console.error, ...args);
  }  
};


const parseJSON = (node, prop) => {
  prop = prop || STATE_ATTR;

  if (validateNode(node) && validateProp(prop)){
    try {
      const json = JSON.parse(node.getAttribute(prop));
      return validateState(json)? json : null;
    }catch(e){ 
      return null;
    }
  }
  return null;
};


const flatten = (acc,list) => {
  if (Array.isArray(acc) && Array.isArray(list)){
    acc = acc.concat(list);
  }
  return acc;
};

const getStatepipeName = node => {
  if (validateNode(node)){
    const name = node.getAttribute(STATEPIPE_ATTR);
    if (name && name.length) return name;
    return null;
  }
  return null;
};

const testSchema = node => {
  if (validateNode(node)){
    return COMPONENT_ATTR_LIST.map(type => {
      if (validateProp(node.getAttribute(type))){
        return {type: ALIAS_STORES[type], node};
      }
    }).filter(schema => schema);
  }
  return null;
};

const queryComponents = (node, statepipeInstance) => {
  if (validateNode(node)){
    const candaidates = Array
      .from(node.querySelectorAll(QUERY_COMPONENTS));
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
        schema.node.statepipe = statepipeInstance;
        schema.wrapper = statepipeInstance;
        return schema;
      });
  }
  return null;
};

const getStoreRunner = type => reducer => {
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
