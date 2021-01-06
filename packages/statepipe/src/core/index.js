import {
  validateNode,
  validateState,
  queryComponents,
  getStatepipeName,
  warn,
} from '../common/src/index';
import {QUERY_STATEPIPE, ACTION_ATTR, STATE_ATTR} from '../common/src/const';

import getSchemas from './getSchemas';
import initTrigger from './initTrigger';
import handleMutation from './handleMutation';

const instances = {};

const getComponents = (wrapper, name, stores) =>
  queryComponents(wrapper, name)
    .filter(item => item)
    .map(getSchemas(stores))
    .map(initTrigger)
    .filter(item => item);

const scan = stores => wrapper => {
  const name = getStatepipeName(wrapper);

  if (!name) {
    return null;
  }

  if (instances[name] !== undefined) {
    warn(`:statepipe "${name}" already taken.`);
    return null;
  }

  const components = getComponents(wrapper, name, stores);

  if (!components.length) {
    return null;
  }

  const ctx = {
    name,
    wrapper,
    stores,
    components,
    addComponents: target => getComponents(target, name, stores),
  };

  ctx.observer = new MutationObserver(handleMutation(ctx)).observe(wrapper, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: [ACTION_ATTR, STATE_ATTR],
  });

  instances[name] = ctx;
};

const statepipe = (wrapper, stores) => {
  if (typeof MutationObserver !== 'function') {
    warn(':statepipe MutationObserver not available');
    return null;
  }

  if (!validateState(stores) || !validateNode(wrapper)) {
    warn(':statepipe invalid store/wrapper');
    return null;
  }

  let children = Array.from(wrapper.querySelectorAll(QUERY_STATEPIPE) || []);

  children = children.reverse();
  children.push(wrapper);
  children.forEach(scan(stores));

  return instances;
};

export default statepipe;
