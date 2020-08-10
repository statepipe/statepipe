import utils from "~/src/statepipe/utils";
import {not, lensPath, set, view} from 'ramda';
import resolveTarget from "./resolveTarget";

const propPick = (targetName, ...args) => (state, event, node, wrapper) => {
  if (not(utils.validateProp(targetName)
    || args.length)) {
    return state;
  }
  const target = resolveTarget(targetName, event, node, wrapper);
  if (not(target)){
    return state;
  }
  return args.reduce((acc, fnName) => {
    const lens = lensPath(fnName.split("."));
    const value = view(lens, target);
    if (value !== undefined){
      acc = set(lens, value, acc);
    }
    return acc;
  }, state);
};

const propSet = (targetName, propName, valueMap) => (state, event, node, wrapper) => {
  propName = propName || "value";
  valueMap = valueMap || "value";

  if (not(utils.validateProp(targetName)
    || utils.validateProp(propName)
    || utils.validateProp(valueMap)
    || utils.validateState(state))) {
    return state;
  }

  const target = resolveTarget(targetName, event, node, wrapper);
  if (not(target)){
    return state;
  }

  const targetValue = view(lensPath(valueMap.split(".")), state);
  if (targetValue === undefined){
    return state;
  }

  propName
    .split(".")
    .reduce((acc, path, index, arr) => {
      const eol = index === arr.length -1;
      acc[path] = eol ? targetValue : {};
      return acc[path];
    }, target);
  
  return state;
};

export default fn => {
 if  (fn === "set"){
   return propSet;
 } else if (fn === "pick") {
   return propPick;
 }
};
