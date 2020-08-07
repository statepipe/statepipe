import dom from "../src/dom";
import render from "../src/render";

//from pipe
import object from "../pipes/object";
import math from "../pipes/math";
import logic from "../pipes/logic";
import list from "../pipes/list";

const pipeIgnorePayload = fn => (...args) => state => {
  args = ["-"].concat(args);
  return fn(...args)(state, state);
};

let api = [object, math, logic, list]
  .reduce((api, reducer) => {
    api = Object.keys(reducer).reduce((acc, fn) => {
      acc[fn] = pipeIgnorePayload(reducer[fn]);
      return acc;
    },api);
    return api;
  },{});

//only for pipes
delete api.from;

export default {
  ...api,
  ...dom,
  ...render
};
