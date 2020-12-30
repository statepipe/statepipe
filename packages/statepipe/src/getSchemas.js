import {
  ALIAS_ATTR,
  flatten,
  isNode,
  isObject,
  log,
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

const getReducers = (type, store) => (slug, index) => {
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
        schema[SCHEMA_ARGS] = parts.filter(prop => prop.trim().length);

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

export const parseStore = stores => item => {
  if (!isObject(item)) return null;
  if (!validateStoreAttrName(item.type)) return null;
  if (!isNode(item.node)) return null;

  const slugList = (item.node.getAttribute(ALIAS_ATTR[item.type]) || '')
    .replace(/\s|\r|\r\n|\n|\s/gim, '')
    .trim()
    .split(',');

  const result = Object.assign(item, {
    reducers: slugList
      .map(getReducers(item.type, stores))
      .filter(item => !!item)
      .reduce(flatten, [])
      .filter(item => item),
  });

  result.reducers.forEach(o => {
    log(
      `:statepipe ${item.node.statepipe}: ${item.type}/ ${
        item.node.nodeName
      } ⋆ ${o.fn} args:${o.args.join(',')}`,
    );
  });

  return result;
};

export default stores => {
  return isObject(stores) ? parseStore(stores) : null;
};
