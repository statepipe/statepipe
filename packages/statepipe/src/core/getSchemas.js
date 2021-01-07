import {
  groupSchemas,
  isNode,
  isObject,
  validateStore,
  not,
  validateStoreAttrName,
} from '../common';

import getReducers from './getReducers';
import {ALIAS_ATTR} from '../common/const';

/**
 * Parse **slug** in order to break into blocks splitted by  ","
 * @param {String} slug
 * @returns {Array}
 */
export const getBlocks = slug => {
  return typeof slug === 'string'
    ? slug
        .replace(/\s|\r|\r\n|\n|\s/gim, '')
        .trim()
        .split(',')
        .filter(str => !!str && !!str.length)
    : null;
};

/**
 * Parse a block list of slugs and return a list with Objects
 * that statepipe will uses to initialize components.
 * 
 * @param {Array} blockList
 * @param {Object} item - ()
 * @param {Object} stores - object that contains all the stores the reducers can call
 * @return {Array}
 */
export const parseReducers = (blockList, item, stores) => {
  if (!!blockList && !!item && item.type && validateStore(stores)) {
    return Array.isArray(blockList) && blockList.length > 0
      ? blockList
          .map(getReducers(item.type, stores))
          .filter(item => !!item)
          .reduce(groupSchemas, [])
          .filter(isObject)
      : null;
  }
  return null;
};

/**
 *
 * @param {Object} stores object with
 */
export const getSchemas = stores => {
  if (not(isObject(stores))) {
    return null;
  }

  if (not(validateStore(stores))) {
    return null;
  }

  return item => {
    if (
      !isObject(item) ||
      !validateStoreAttrName(item.type) ||
      !isNode(item.node)
    ) {
      return null;
    }

    const slug = item.node.getAttribute(ALIAS_ATTR[item.type]) || '';
    const slugList = getBlocks(slug);
    const reducers = parseReducers(slugList, item, stores);

    if (!reducers || (Array.isArray(reducers) && reducers.length == 0)) {
      return null;
    }

    const result = Object.assign(item, {reducers});
    return result;
  };
};

export default getSchemas;
