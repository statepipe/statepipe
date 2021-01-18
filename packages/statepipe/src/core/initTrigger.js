import {not, validateProp, isNode, isObject} from '../common/';
import {TRIGGER_STORE} from '../common/const';
import {log} from '../common/log';

import handleTrigger from './handleTrigger';

export const TARGET_DOC_ELEMENT = 'documentElement';
export const TARGET_DOCUMENT = 'document';
export const TARGET_WINDOW = 'window';
export const TARGET_BODY = 'body';
export const TARGETS = {
  [TARGET_DOC_ELEMENT]: document.documentElement,
  [TARGET_DOCUMENT]: document,
  [TARGET_WINDOW]: window,
  [TARGET_BODY]: document.body,
};

export const parseTarget = (slug, node) => {
  if (not(validateProp(slug)) || not(node)){
    return null;
  }
  const slices = slug.split(".");
  if (slices.length !== 2){
    return {event:slug, target:node};
  }
  const bind = slices[0].trim();
  const event = slices[1].trim();
  if (!bind.length){
    return {event:slug, target:node};
  }
  return [
    TARGET_DOC_ELEMENT,
    TARGET_DOCUMENT,
    TARGET_WINDOW,
    TARGET_BODY
  ].reduce((acc, item)=>{
    if (bind.match(new RegExp(`^${item}$`))){
      acc = {
        event: event,
        target:TARGETS[item]
      };
    }
    return acc;
  }, {
    event:slug,
    target:node
  });
};
 
export default blob => {
  blob = blob || {};
  if (
    not(isObject(blob)) ||
    not(isNode(blob.node)) ||
    not(blob.type === TRIGGER_STORE) ||
    not(Array.isArray(blob.reducers))
  ) {
    return null;
  }

  blob.reducers = blob.reducers
    .map(schema => {
      
      if (not(schema)
      || not(schema.fn)
      || not(typeof schema.fn === 'string')
      || not(!!schema.fn.match(/.@./))) {
        return schema;
      }
      const actionAndHandler = schema.fn.split('@');
      const action = actionAndHandler[0];
      let eventHandler = actionAndHandler[1];
      const {target, event} = parseTarget(eventHandler, blob.node);
      if (validateProp(action) && validateProp(event)) {
        if (!!target && typeof target.addEventListener === 'function') {
          target.addEventListener(event, handleTrigger(blob));
          log(
            `:statepipe ${blob.wrapper||''}: ${blob.type}/ ${target.nodeName} (${
              schema.index
            }) bind "${event}"`,
          );
        }
        return null;
      }
      return schema;
    })
    .filter(schema => schema);

  return blob;
};
