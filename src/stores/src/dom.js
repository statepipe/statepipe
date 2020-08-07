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

const fnGet = (targetName, fnName, targetProp) =>  (state, event, node, wrapper) => {
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
  fnRun,
  fnGet,
  propPick,
  nodeProp: addProp,
};
