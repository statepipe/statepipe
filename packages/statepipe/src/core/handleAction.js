import {
  validateProp,
  injectBlobFnFromStore,
  isNode,
  isObject,
  parseJSON,
} from '../common';
import {PIPE_STORE, STATE_ATTR} from '../common/const';
import {log, warn} from '../common/log';

export const CTX_ACTION = 'action';
export const CTX_PAYLOAD = 'payload';
export const CTX_STATE = 'state';
export const CTX_NODE = 'node';
export const CTX_ORIGIN = 'origin';
export const CTX_WRAPPER = 'wrapper';
export const CTX_PROPS = [
  CTX_ACTION,
  CTX_PAYLOAD,
  CTX_STATE,
  CTX_NODE,
  CTX_ORIGIN,
  CTX_WRAPPER,
];

/**
 *
 * @param {String} action
 * @param {Object} payload
 * @param {HTMLElement} origin
 */
const handleAction = (action, payload, origin) => {
  if (
    !isObject(payload) ||
    !isNode(origin) ||
    !origin.statepipe ||
    !validateProp(action)
  ) {
    return null;
  }

  /**
   * Schema to resolve the given action.
   * @param {Object} schema
   * @return schema
   */
  return schema => {
    if (
      !isObject(schema) ||
      !isNode(schema.node) ||
      PIPE_STORE !== schema.type
    ) {
      return null;
    }

    const prefix = `:statepipe ${schema.node.statepipe}: ${schema.type}/ ${schema.node.nodeName}`;
    const currentState = parseJSON(schema.node);

    const resolveAction = (block, newState) => {
      if (!isObject(newState)) {
        log(`${prefix} (${block}) ∴ no state changes!`);
        return;
      }

      const sNState = JSON.stringify(newState);
      const sState = JSON.stringify(currentState);

      if (validateProp(sNState) && validateProp(sState) && sNState !== sState) {
        schema.node.setAttribute(STATE_ATTR, sNState);
        log(`${prefix} (${block}) ∴ state`, sNState);
      } else {
        log(`${prefix} (${block}) ∴ no state changes!`);
      }
    };

    if (!isObject(currentState)) {
      return null;
    }

    let newState, index;

    try {
      schema.reducers = schema.reducers.filter(
        injectBlobFnFromStore(schema.type),
      );

      newState = schema.reducers.reduce((acc, reducer) => {
        if (index !== reducer.index) {
          if (index !== undefined) {
            //resolve prev blocks action
            resolveAction(index, acc);
          }
          index = reducer.index;
          acc = currentState;
        }
        if (isObject(acc)) {
          const fn = reducer.run.apply(reducer, reducer.args);
          if (typeof fn === 'function') {
            acc = fn({
              [CTX_ACTION]: action,
              [CTX_PAYLOAD]: payload,
              [CTX_STATE]: acc,
              [CTX_NODE]: schema.node,
              [CTX_ORIGIN]: origin,
              [CTX_WRAPPER]: schema.wrapper,
            });
            log(
              `${prefix} (${reducer.index}) > ${reducer.fn}(${(
                reducer.args || []
              ).join(',')}) payload`,
              payload,
              'state',
              acc,
              'action: ' + action,
            );
          } else {
            log(
              `${prefix} (${reducer.index}) > ${reducer.fn}(${(
                reducer.args || []
              ).join(',')}) reducer is not a function!`,
              acc,
            );
          }
        }
        return acc;
      }, currentState);

      //resolve last blocks action
      if (schema.reducers.length) {
        const lastIndex = schema.reducers[schema.reducers.length - 1].index;
        resolveAction(lastIndex, newState);
      }
    } catch (err) {
      warn(`${prefix} > error running reducers!`, err);
    }
    return schema;
  };
};

export default handleAction;
