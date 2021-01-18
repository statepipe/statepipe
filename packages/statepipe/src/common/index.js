import {
  STATEPIPE_ATTR,
  STATE_ATTR,
  TRIGGER_STORE,
  PIPE_STORE,
  OUT_STORE,
  QUERY_COMPONENTS,
  ALIAS_STORES,
  COMPONENT_ATTR_LIST,
} from './const';

import {warn, error, log} from './log';

/**
 * Check if **store** has at least one of the expected store names
 * @param {Object} store
 * @returns {Boolean}
 */
export const validateStore = store =>
  !!store &&
  (isObject(store[PIPE_STORE]) ||
    isObject(store[OUT_STORE]) ||
    isObject(store[TRIGGER_STORE]));

/**
 * Check if **attr** is part of expected store names
 * @param {String} attr attr name to test
 * @returns {Boolean}
 */
export const validateStoreAttrName = attr =>
  [TRIGGER_STORE, OUT_STORE, PIPE_STORE].includes(attr);

/**
 * Test if **value** is a falsy value
 * @param {*} value
 * @returns {Boolean}
 */
export const not = value => !value;

/**
 * Test if **prop** is a not empty string
 * @param {String} prop
 */
export const validateProp = prop =>
  typeof prop === 'string' && prop.trim().length > 0;

/**
 * Test if **value** is a Object
 * @param {Object} value
 * @returns {Boolean}
 */
export const isObject = value =>
  value !== null &&
  value !== undefined &&
  typeof value === 'object' &&
  not(Array.isArray(value));

/**
 * Test if **node** has the expected props required
 * by statepipe to run
 * @param {*} node
 * @returns {Boolean}
 */
export const isNode = node =>
  isObject(node) &&
  isObject(node.parentNode) &&
  !!node.nodeName &&
  typeof node.addEventListener === 'function' &&
  typeof node.setAttribute === 'function' &&
  typeof node.querySelectorAll === 'function' &&
  typeof node.getAttribute === 'function';

/**
 * This will extract the content of attribute **prop**
 * and try to parse it as a json.
 *
 * Ex:
 *
 * var str = node.gettAttribute(prop)
 * return JSON.parse(str)
 * @param {HTMLElement} node
 * @param {String} prop . prop nome to extract. default STATE_ATTR
 */
export const parseJSON = (node, prop = STATE_ATTR) => {
  if (isNode(node) && validateProp(prop)) {
    try {
      const json = JSON.parse(node.getAttribute(prop));
      return isObject(json) ? json : null;
    } catch (e) {
      warn(e);
      return null;
    }
  }
  return null;
};

/**
 * Append **list** into **acc**
 * @param {acc} acc
 * @param {list} list
 * @returns {Array}
 */
export const groupSchemas = (acc, list) => {
  if (Array.isArray(acc) && Array.isArray(list)) {
    return acc.concat(list);
  }
  return null;
};

/**
 * Check if the given **node** has the avalid STATEPIPE_ATTR defined
 * @param {HTMLElement} node
 * @returns {Boolean}
 */
export const getStatepipeName = node => {
  if (isNode(node)) {
    const name = node.getAttribute(STATEPIPE_ATTR);
    return validateProp(name) ? name.trim() : null;
  }
  return null;
};

/**
 * Parses the node testing for expected property and names not empty
 * Ex:
 * //my node
 * node = <span :trigger="foo">foo</span>
 * testSchema(node)
 * // returns [{type:trigger,node}]
 *
 * * //my node
 * node = <span :trigger="foo" :pipe="bar">foo</span>
 * testSchema(node)
 * // returns [{type:trigger,node},{type:pipe,node}]
 *
 * @param {HTMLElement} node
 * @returns {Array}  list of blob
 */
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

/**
 * This method will map all the components
 * that matches expected statepipe props and
 * return a list of Objects with the proper type
 * and the reference to the node.
 *
 * @param {HTMLElement} node
 * @param {String} statepipeInstance
 * @returns {Array} [{type, node}, {type,node}...]
 */
export const queryComponents = (node, statepipeInstance) => {
  if (not(validateProp(statepipeInstance)) || not(isNode(node))) {
    return null;
  }

  const candaidates = Array.from(node.querySelectorAll(QUERY_COMPONENTS));
  return [node]
    .concat(candaidates)
    .map(testSchema)
    .filter(schema => schema)
    .reduce(groupSchemas, [])
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

/**
 * Set a new prop **run** on **block** with
 * the function at specific store.
 *
 * @param {String} type any of OUT_STORE, PIPE_STORE or TRIGGER_STORE
 * @return {Object}
 */
export const injectBlobFnFromStore = type => block => {
  if (
    isObject(block) &&
    isObject(block.store) &&
    validateProp(type) &&
    validateProp(block.fn) &&
    isObject(block.store[type]) &&
    typeof block.store[type][block.fn] === 'function'
  ) {
    block.run = block.store[type][block.fn];
    return block;
  }
  return null;
};

export default {
  log,
  warn,
  error,
  groupSchemas,
  parseJSON,
  validateProp,
  isObject,
  isNode,
  validateStoreAttrName,
  getStatepipeName,
  injectBlobFnFromStore,
  queryComponents,
};
