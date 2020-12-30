import utils from './utils';

const getPayload = (schema, event) => (acc, reducer) => {
  if (
    utils.validateState(acc) &&
    utils.validateState(reducer) &&
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
        utils.log(
          `${prefix} (${reducer.index}) > ${reducer.fn}(${(
            reducer.args || []
          ).join(',')}) partial payload:`,
          acc,
        );
      } else {
        utils.log(
          `${prefix} (${reducer.index}) > ${reducer.fn}(${(
            reducer.args || []
          ).join(',')}) reducer is not a function!`,
          acc,
        );
      }
    } catch (err) {
      utils.warn(
        `${prefix} ${reducer.fn}(${reducer.args.join(',')}) error:`,
        err,
      );
      acc = null;
    }
  }
  return acc;
};

export default schema => {
  if (!utils.validateState(schema) || !utils.validateNode(schema.node)) {
    return null;
  }
  return event => {
    //update reducers list with only items with valid store
    let reducers = schema.reducers.filter(utils.getStoreRunner(schema.type));
    const oldstate = utils.parseJSON(schema.node);

    if (!utils.validateState(oldstate)) {
      return schema;
    }

    const resolveTrigger = (block, value) => {
      if (utils.validateState(value) && Object.keys(value).length) {
        utils.log(
          `:statepipe ${schema.wrapper.getAttribute(':statepipe')}: ${
            schema.type
          }/ ${schema.node.nodeName} (${block.index}) ∴ action=${
            block.action
          } payload`,
          value,
        );
        schema.node.setAttribute(utils.PAYLOAD_ATTR, JSON.stringify(value));
        schema.node.setAttribute(utils.ACTION_ATTR, block.action);
      } else {
        utils.log(
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
