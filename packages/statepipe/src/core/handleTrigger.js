import {isObject, parseJSON, isNode, injectBlobFnFromStore} from '../common';
import {PAYLOAD_ATTR, ACTION_ATTR} from '../common/const';
import {log,warn} from '../common/log';

const getPayload = (schema, event) => (acc, reducer) => {
  if (
    isObject(acc) &&
    isObject(reducer) &&
    typeof reducer.run === 'function'
  ) {
    const prefix = `:statepipe ${schema.wrapper.getAttribute(':statepipe')}: ${
      schema.type
    }/ ${schema.node.nodeName}`;
    try {
      const fn = reducer.run.apply(null, reducer.args);
      if (typeof fn === 'function') {
        acc = fn({
          event,
          action: reducer.action,
          wrapper: schema.wrapper,
          state: acc,
          node: schema.node,
        });
        log(
          `${prefix} (${reducer.index}) > ${reducer.fn}(${(
            reducer.args || []
          ).join(',')}) partial payload:`,
          acc,
        );
      } else {
        log(
          `${prefix} (${reducer.index}) > ${reducer.fn}(${(
            reducer.args || []
          ).join(',')}) reducer is not a function!`,
          acc,
        );
      }
    } catch (err) {
      warn(
        `${prefix} ${reducer.fn}(${reducer.args.join(',')}) error:`,
        err,
      );
      acc = null;
    }
  }
  return acc;
};

export default schema => {
  if (!isObject(schema) || !isNode(schema.node)) {
    return null;
  }
  return event => {
    //update reducers list with only items with valid store
    let reducers = schema.reducers.filter(
      injectBlobFnFromStore(schema.type),
    );
    const oldstate = parseJSON(schema.node);

    if (!isObject(oldstate)) {
      return schema;
    }

    const resolveTrigger = (block, value) => {
      if (isObject(value) && Object.keys(value).length) {
        log(
          `:statepipe ${schema.wrapper.getAttribute(':statepipe')}: ${
            schema.type
          }/ ${schema.node.nodeName} (${block.index}) ∴ action=${
            block.action
          } payload`,
          value,
        );
        schema.node.setAttribute(PAYLOAD_ATTR, JSON.stringify(value));
        schema.node.setAttribute(ACTION_ATTR, block.action);
      } else {
        log(
          `:statepipe ${schema.wrapper}: ${schema.type}/ ${schema.node.nodeName} (${block.index}) ∴ action ${block.action} wont be fired!`,
        );
      }
    };

    let index, resolveBlock;
    const payload = reducers
      .filter(
        item =>
          item &&
          item.event &&
          item.event === (event || {}).type &&
          item.event !== undefined,
      )
      .reduce((acc, block) => {
        if (index !== block.index) {
          if (index !== undefined) {
            resolveTrigger(block, acc);
          }
          index = block.index;
          resolveBlock = block;
          acc = oldstate;
        }
        return getPayload(schema, event)(acc, block);
      }, oldstate);

    if (resolveBlock) {
      resolveTrigger(resolveBlock, payload);
    }

    return schema;
  };
};
