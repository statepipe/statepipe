import math from "./math";
import object from "./object";
import logic from "./logic";
import list from "./list";
import node from "../src/node";

const stateAndNode = fn => (...args) => (payload,state,node) => fn(...args)(state,node);

//inject node
const api = Object.keys(node)
  .reduce((acc,fn)=>{
    acc[fn] = stateAndNode(node[fn]);
    return acc;
}, {});

export default {
  ...api,
  ...list,
  ...math,
  ...logic,
  ...object
};
