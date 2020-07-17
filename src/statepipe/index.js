import utils from "./utils";
import getSchemas from "./getSchemas";
import initTrigger from "./initTrigger";
import handleMutation from "./handleMutation";

const instances = {};

const getComponents = (wrapper, name, stores) =>  utils
  .queryComponents(wrapper, name)
  .filter(item => item)
  .map(getSchemas(stores))
  .map(initTrigger)
  .filter(item => item);

const scan = stores => wrapper => {
  const name = utils.getStatepipeName(wrapper);

  if (!name){
    return null;
  }

  if (instances[name] !== undefined) {
    utils.warn(`:statepipe "${name}" already taken.`);
    return null;
  }

  const components = getComponents(wrapper, name, stores);
  
  if (!components.length) {
    return null;
  }

  const ctx = {
    name, wrapper, stores, components,
    addComponents : target => getComponents(target, name, stores)
  };

  ctx.observer = new MutationObserver(handleMutation(ctx))
    .observe(wrapper, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: [
        utils.ACTION_ATTR, 
        utils.STATE_ATTR
      ]
    });

    instances[name] = ctx;
};

const statepipe = (wrapper, stores) => {

  if (typeof MutationObserver !== "function") {
    utils.warn(":statepipe MutationObserver not available");
    return null;
  }

  if (!utils.validateState(stores)
  || !utils.validateNode(wrapper)) {
    utils.warn(":statepipe invalid store/wrapper");
    return null;
  }

  let children = Array
    .from(wrapper.querySelectorAll(utils.QUERY_STATEPIPE)||[]);

  children = children.reverse();
  children.push(wrapper);
  children.forEach(scan(stores));

  return instances;
};

export default statepipe;
