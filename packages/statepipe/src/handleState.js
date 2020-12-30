import utils from './utils';

export default schema => {
  if (!utils.validateState(schema) || !Array.isArray(schema.reducers)) {
    return null;
  }

  const logPrefix = `:statepipe ${schema.node.statepipe}: ${utils.OUT_STORE}/${schema.node.nodeName}`;
  const state = utils.parseJSON(schema.node);

  if (!utils.validateState(state)) {
    return null;
  }

  try {
    schema.reducers = schema.reducers.filter(utils.getStoreRunner(schema.type));

    let index;
    schema.reducers.reduce((acc, reducer) => {
      if (index === undefined || index !== reducer.index) {
        index = reducer.index;
        acc = state;
      }
      if (acc && utils.validateState(acc)) {
        const fn = reducer.run.apply(reducer, reducer.args);
        if (typeof fn === 'function') {
          acc = fn({
            state: acc,
            node: schema.node,
            wrapper: schema.node,
          });
          utils.log(
            `${logPrefix} (${reducer.index}) ∴ ${reducer.fn}(${(
              reducer.args || []
            ).join(',')}) state:`,
            acc,
          );
        } else {
          utils.log(
            `${logPrefix} (${reducer.index}) > ${reducer.fn}(${(
              reducer.args || []
            ).join(',')}) reducer is not a function!`,
            acc,
          );
        }
      }
      return acc;
    }, state);
  } catch (err) {
    utils.warn(`${logPrefix} error`, err);
  }
};
