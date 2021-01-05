import {
  STATEPIPE_ATTR,
  STATE_ATTR,
  TRIGGER_STORE,
  TRIGGER_ATTR,
  PIPE_STORE,
  PIPE_ATTR,
  OUT_STORE,
  OUT_ATTR,
  QUERY_COMPONENTS,
  QUERY_STATEPIPE,
  ALIAS_ATTR,
  ALIAS_STORES,
  COMPONENT_ATTR_LIST,
  PAYLOAD_ATTR,
  ACTION_ATTR,
} from './const';

export const validateStore = store => {
  return !!store[PIPE_STORE] || !!store[OUT_STORE] || !!store[TRIGGER_STORE];
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
  if (window.$statepipeLog === true) {
    console.log.call(console.log, ...args);
  }
};

export const warn = (...args) => {
  if (window.$statepipeLog === true) {
    console.warn.call(console.warn, ...args);
  }
};

export const error = (...args) => {
  if (window.$statepipeLog === true) {
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
  if (not(validateProp(statepipeInstance)) || not(isNode(node))) {
    return null;
  }

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
};