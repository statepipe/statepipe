import {
  validateStoreAttrName,
  not,
  isObject,
  validateProp,
} from '../common/index';

import {
  TRIGGER_STORE,
  SCHEMA_STORE,
  SCHEMA_SLUG,
  SCHEMA_INDEX,
  SCHEMA_FN,
  SCHEMA_EVENT,
  SCHEMA_ARGS,
  SCHEMA_ACTION,
} from '../common/const';

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
export default (type, store) => {
  if (!validateStoreAttrName(type) || not(isObject(store))) {
    return null;
  }
  /**
   * Handle all slug names in order to strip actions, params etc
   * and create a List of Store Reducers to be used
   * by **statepipe**
   *
   * @param {String} slug  foo|bar, fire@click, fire@click|foo:bar|loren
   * @param {Number} index Block execution order
   * @returns {Array} list of Objects [{TRIGGER_PROPS},{PIPE_PROPS},{OUT_PROPS}]
   */
  return (slug, index) => {
    if (not(validateProp(slug)) || typeof index !== 'number') {
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
      let pair = pipes[0].match(/^(.*)@(.*)$/);
      if (
        pair &&
        pair.length > 1 &&
        validateProp(pair[1]) &&
        validateProp(pair[2])
      ) {
        event = pair[2].trim();
        action = pair[1].trim();
        if (not(validateProp(event)) || not(validateProp(action))) {
          return null;
        }
      }
    }

    //First block on triggers are designed to define the action
    //and the event bind. Without reducers it is worthless.
    if (type === TRIGGER_STORE && pipes.length === 1) {
      return null;
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
            schema[SCHEMA_ACTION] = action;
            schema[SCHEMA_EVENT] = event.split('.').pop();
          }
          return schema;
        }
        return null;
      })
      .filter(item => !!item)
      .filter(item => {
        //only trigger with action pass
        if (type === TRIGGER_STORE) {
          return item[SCHEMA_ACTION] && item[SCHEMA_EVENT] ? item : null;
        }
        return item;
      });
  };
};
