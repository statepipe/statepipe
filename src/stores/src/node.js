import {not, lensPath, set, view} from 'ramda';
import utils from "~/src/statepipe/utils";

const testArgs = (state, node) => utils.validateState(state)
  && utils.validateState(node);

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

const runNodeFn = (...args) =>  (state, node) => {

  if (not(testArgs(state,node))){
    return state;
  }

  args.forEach(fName => {
     if (utils.validateProp(fName)
     && typeof node[fName] === "function"){
        node[fName]();
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
  nodeFn: runNodeFn,
  nodeProp: addProp,
};
