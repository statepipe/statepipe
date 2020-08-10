import utils from "~/src/statepipe/utils";
import {not, lensPath, set, view} from 'ramda';
import resolveTarget from "./resolveTarget";

const fnRun = (targetName, ...args) =>  (state, event, node, wrapper) => {
  if (not(utils.validateProp(targetName)
    || args.length)) {
    return state;
  }
  const target = resolveTarget(targetName, event, node, wrapper);
  if (not(target)){
    return state;
  }
  args.forEach(fnName => {
    const fn = view(lensPath(fnName.split(".")), target);
    if (typeof fn === "function"){
      fn();
    }
  });
  return state;
};

const fnGet = (targetName, fnName, targetProp) => (state, event, node, wrapper) => {
  targetProp = targetProp || "value";

  if (not( utils.validateProp(targetName)
    || utils.validateProp(fnName)
    || utils.validateProp(targetProp)
    || utils.validateState(state))
    ) {
    return state;
  }

  const target = resolveTarget(targetName, event, node, wrapper);
  if (not(target)){
    return state;
  }

  const fn = view(lensPath(fnName.split(".")), target);
  if (typeof fn === "function"){
    const result = fn();
    state = set(lensPath(targetProp.split(".")), result, state);
  }

  return state;
};

export default fn => {
  if  (fn === "get"){
    return fnGet;
  } else if (fn === "run") {
    return fnRun;
  }
 };
 