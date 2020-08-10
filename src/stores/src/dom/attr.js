import utils from "~/src/statepipe/utils";
import {not, lensPath, set, view} from 'ramda';
import resolveTarget from "./resolveTarget";

export default fn => (targetName, attrName, attrValue, ...args) =>
  (state, event, node, wrapper) => {
    
    attrName = attrName || "value";

    var toPick = [attrName, attrValue].concat(args).filter(prop => !!prop);

    attrValue = attrValue || "value";

  if (not(utils.validateProp(targetName)
    || utils.validateProp(attrName)
    || utils.validateProp(attrValue)
    || utils.validateState(state))) {
    return state;
  }

  const target = resolveTarget(targetName, event, node, wrapper);
  if (not(target) || targetName.match(/event|history|window/)){
    return state;
  }

  let targetValue;
  if (fn.match(/set|togg/)){
    targetValue = view(lensPath(attrValue.split(".")), state);
    if (targetValue === undefined){
      return state;
    }
  }

  if (fn === "set"
  && target.getAttribute(attrName) !== targetValue){
   target.setAttribute(attrName, targetValue);
  }
  else if (fn === "rm"
  && target.hasAttribute(attrName)){
   target.removeAttribute(attrName);
  }
  else if (fn === "togg") {
    if (target.getAttribute(attrName) !== targetValue){
      target.setAttribute(attrName, targetValue);
    } else {
      target.removeAttribute(attrName);
    }
  }
  else if (fn === "pick"){
    return toPick.reduce((acc, prop) => {
      const val = target.getAttribute(prop);
      if (val !== undefined){
        acc = set(lensPath(prop.split(".")), val, acc);
      }
      return acc;
    }, state);
  }
  return state;
};
