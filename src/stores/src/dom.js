import {not, lensPath, set, view} from 'ramda';
import utils from "~/src/statepipe/utils";

const testArgs = (state, node) => utils.validateState(state)
  && utils.validateState(node);

const resolveTarget = (value, event, node, ctx) => {
  if (value === "event") return event;
  if (value === "self") return node;
  if (value === "ctx") return ctx;
  if (value === "doc")  return document;
  if (value === "docElm")  return document.documentElement;
  if (value === "body")  return document.body;
  if (value === "win")  return window;
  if (value === "history")  return history;
  return null;
};

const pickPropFromNode = (...args) => (state, node) => {
  if (not(testArgs(state,node))){
    return state;
  }

  if (not(args.length)) {
    args = ["value"];
  }

  return Array.from(args)
    .reduce((acc, propPath) => {
      const path = lensPath(propPath.split("."));
      const value = view(path, node);
      if (value !== undefined) {
        acc = set(path, value, acc);
      }
      return acc;
    },{...state});
};

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

const addProp = (propName, map) => (state, node) => {
  map = map || "value";
  if (not(testArgs(state,node))
  || not(utils.validateProp(propName))
  || not(utils.validateProp(map))
  ) {
    return state;
  }
  
  const value = view(lensPath(map.split(".")), state);
  if (value !== undefined) {
    node[propName] = value;
  }
  return state;
};

export default {
  nodePick: pickPropFromNode,
  fnRun: fnRun,
  nodeProp: addProp,
};
