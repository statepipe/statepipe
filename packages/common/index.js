export const STATEPIPE_ATTR = ':statepipe';
export const STATE_ATTR = ':state';
export const PIPE_ATTR = ':pipe';
export const TRIGGER_ATTR = ':trigger';
export const OUT_ATTR = ':out';
export const PAYLOAD_ATTR = ':payload';
export const ACTION_ATTR = ':action';

export const OUT_STORE = 'out';
export const PIPE_STORE = 'pipe';
export const TRIGGER_STORE = 'trigger';

export const QUERY_COMPONENTS = `[\\${TRIGGER_ATTR}],[\\${PIPE_ATTR}],[\\${OUT_ATTR}]`;
export const QUERY_STATEPIPE = `[\\${STATEPIPE_ATTR}]`;
export const COMPONENT_ATTR_LIST = [OUT_ATTR, PIPE_ATTR, TRIGGER_ATTR];

export const ALIAS_STORES = {
  [PIPE_ATTR]: PIPE_STORE,
  [OUT_ATTR]: OUT_STORE,
  [TRIGGER_ATTR]: TRIGGER_STORE,
};

export const ALIAS_ATTR = {
  [PIPE_STORE]: PIPE_ATTR,
  [OUT_STORE]: OUT_ATTR,
  [TRIGGER_STORE]: TRIGGER_ATTR,
};

export const not = value => !value;

export const validateProp = prop =>
  typeof prop === 'string' && prop.trim().length > 0;

export const isObject = value =>
  value !== null &&
  value !== undefined &&
  typeof value === 'object' &&
  not(Array.isArray(value));

export const isNode = node =>
  isObject(node) &&
  isObject(node.parentNode) &&
  !!node.nodeName &&
  typeof node.addEventListener === 'function' &&
  typeof node.setAttribute === 'function' &&
  typeof node.querySelectorAll === 'function' &&
  typeof node.getAttribute === 'function';

export const validateStoreAttrName = attr =>
  [TRIGGER_STORE, OUT_STORE, PIPE_STORE].includes(attr);

export const log = (...args) => {
  if ($statepipeLog === true) {
    console.log.call(console.log, ...args);
  }
};

export const warn = (...args) => {
  if ($statepipeLog === true) {
    console.warn.call(console.warn, ...args);
  }
};

export const error = (...args) => {
  if ($statepipeLog === true) {
    console.error.call(console.error, ...args);
  }
};

export const parseJSON = (node, prop) => {
  prop = prop || STATE_ATTR;

  if (isNode(node) && validateProp(prop)) {
    try {
      const json = JSON.parse(node.getAttribute(prop));
      return isObject(json) ? json : null;
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const flatten = (acc, list) => {
  if (Array.isArray(acc) && Array.isArray(list)) {
    acc = acc.concat(list);
  }
  return acc;
};

export const getStatepipeName = node => {
  if (isNode(node)) {
    const name = node.getAttribute(STATEPIPE_ATTR);
    return validateProp(name) ? name.trim() : null;
  }
  return null;
};

export const testSchema = node => {
  if (isNode(node)) {
    return COMPONENT_ATTR_LIST.map(type => {
      if (validateProp(node.getAttribute(type))) {
        return {type: ALIAS_STORES[type], node};
      }
    }).filter(schema => schema);
  }
  return null;
};

export const queryComponents = (node, statepipeInstance) => {
  if (isNode(node)) {
    const candaidates = Array.from(node.querySelectorAll(QUERY_COMPONENTS));
    return [node]
      .concat(candaidates)
      .map(testSchema)
      .filter(schema => schema)
      .reduce(flatten, [])
      .filter(schema => !schema.wrapper)
      .filter(schema => {
        if (schema.node.statepipe) {
          return null;
        }
        return schema;
      })
      .map(schema => {
        schema.node.statepipe = statepipeInstance;
        schema.wrapper = node;
        return schema;
      });
  }
  return null;
};

export const getStoreRunner = type => reducer => {
  if (
    isObject(reducer) &&
    isObject(reducer.store) &&
    validateProp(type) &&
    validateProp(reducer.fn) &&
    isObject(reducer.store[type]) &&
    typeof reducer.store[type][reducer.fn] === 'function'
  ) {
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
  isObject,
  isNode,
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
  ACTION_ATTR,
};
