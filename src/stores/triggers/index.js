//general
import node from "../src/node";
import event from "../src/event";

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
   (state,event,node) => fn(...args)(state, node);
  
let api = [object ,math ,logic ,list].reduce((api, reducer)=>{
  api = Object.keys(reducer).reduce((acc,fn)=>{
    acc[fn] = pipeIgnorePayload(reducer[fn]);
    return acc;
  },api);
  return api;
},{});

//only for pipes
delete api.from;

//inject node
api = Object.keys(node)
  .reduce((acc,fn)=>{
    acc[fn] = stateAndNode(node[fn]);
    return acc;
}, api);

export default {
  ...api,
  ...event
};
