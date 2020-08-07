//general
import dom from "../src/dom";

//from pipe
import object from "../pipes/object";
import math from "../pipes/math";
import logic from "../pipes/logic";
import list from "../pipes/list";

const pipeIgnorePayload = fn => (...args) => state => {
  args = ["-"].concat(args);
  return fn(...args)(state, state);
};

const stateAndNode = fn => (...args) =>
   (state, event, node) => fn(...args)(state, node);
  
let api = [object, math, logic, list]
  .reduce((api, reducer)=>{
    api = Object.keys(reducer).reduce((acc,fn) => {
      acc[fn] = pipeIgnorePayload(reducer[fn]);
      return acc;
    },api);
    return api;
  },{});

//only for pipes
delete api.from;

//fix params for dom reducers
api = Object.keys(dom)
  .reduce((acc,fn) => {
    acc[fn] = stateAndNode(dom[fn]);
    return acc;
}, api);

export default {
  ...api,
  ...event
};
