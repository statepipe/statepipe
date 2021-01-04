import {
  ALIAS_ATTR,
  flatten,
  isNode,
  isObject,
  log,
  not,
  TRIGGER_STORE,
  validateProp,
  validateStoreAttrName,
} from '../../common/src/index';

export const SCHEMA_INDEX = 'index';
export const SCHEMA_STORE = 'store';
export const SCHEMA_SLUG = 'slug';
export const SCHEMA_ACTION = 'action';
export const SCHEMA_EVENT = 'event';
export const SCHEMA_FN = 'fn';
export const SCHEMA_ARGS = 'args';

export const TRIGGER_PROPS = [
  SCHEMA_INDEX,
  SCHEMA_STORE,
  SCHEMA_SLUG,
  SCHEMA_FN,
  SCHEMA_ARGS,
  SCHEMA_ACTION,
  SCHEMA_EVENT,
];

export const PIPE_PROPS = [
  SCHEMA_INDEX,
  SCHEMA_STORE,
  SCHEMA_SLUG,
  SCHEMA_FN,
  SCHEMA_ARGS,
];

export const OUT_PROPS = [
  SCHEMA_INDEX,
  SCHEMA_STORE,
  SCHEMA_SLUG,
  SCHEMA_FN,
  SCHEMA_ARGS,
];

/**
 * This reducer is designed to run inside **parseReducers**
 * and work in 2 steps.
 * The fisrt capture the type and store and return a function that will
 * parse all the slugs it gets and return an Array of reducers
 * 
 * @param {String} type 
 * @param {Object} store 
 * @returns {Function}
 */
export const getReducers = (type, store) => {

  if (!validateStoreAttrName(type)
  || not(isObject(store))) {
    return null;
  }
  /**
   * Handle all slug names in order to strip actions, params etc
   * and create a List of Store Reducers to be used
   * by **statepipe**
   * @param {String} slug  Slug name
   * @param {Number} index Block execution order
   * @returns {Array}
   */
  return (slug, index) => {
  
    if (typeof slug !== "string"
    || typeof index !== "number"
    || (typeof slug === "string" && !slug.length)) {
      return null;
    }
  
    let pipes = slug
      .trim()
      .split('|')
      .map(val => val.trim())
      .filter(val => val.length);
  
    if (pipes.length < 1) {
      return null;
    }
  
    let action, event;
    if (type === TRIGGER_STORE) {
      action = pipes[0].match(/^(.*)@(.*)$/);
      if (action && action.length > 1 && validateProp(action[1])) {
        event = action[2].trim();
        action = action[1].trim();
      }
    }
  
    return pipes
      .map(blob => {
        const parts = blob.split(':');
        const fn = parts.splice(0, 1)[0];
        if (validateProp(fn)) {
          const schema = {};
          schema[SCHEMA_INDEX] = index;
          schema[SCHEMA_STORE] = store;
          schema[SCHEMA_SLUG] = blob;
          schema[SCHEMA_FN] = fn;
          schema[SCHEMA_ARGS] = parts
                                  .map(prop => prop.trim())
                                  .filter(prop => !!prop && !!prop.length);
  
          if (type === TRIGGER_STORE && validateProp(action)) {
            schema.action = action;
            schema.event = event.split('.').pop();
          }
          return schema;
        }
        return null;
      })
      .filter(item => !!item)
      .filter(item => {
        //only trigger with action pass
        if (type === TRIGGER_STORE) {
          return item.action ? item : null;
        }
        return item;
      });
  };
};

export const getBlocks = (slug) => {
  return typeof slug === "string" ? slug
  .replace(/\s|\r|\r\n|\n|\s/gim, '')
  .trim()
  .split(',')
  .filter(str => !!str && !!str.length) : null;
};

export const parseReducers = (blockList, item, stores) => {
  return Array.isArray(blockList) && blockList.length > 0 ? blockList
  .map(getReducers(item.type, stores))
  .filter(item => !!item)
  .reduce(flatten, [])
  .filter(isObject) : null ;
};

export const parseStore = stores => item => {
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

  if (!reducers
    || Array.isArray(reducers) && reducers.length == 0){
      return null;
  }

  const result = Object.assign(item, {reducers});

  result.reducers.forEach(o => {
    log(
      `:statepipe ${item.node.statepipe}: ${item.type}/ ${
        item.node.nodeName
      } ⋆ ${o.fn} args:${o.args.join(',')}`,
    );
  });

  return result;
};

export default parseStore;
