import math from "./math";
import object from "./object";
import logic from "./logic";
import list from "./list";
import dom from "../src/dom";

const stateAndNode = fn => (...args) =>
   (payload, state, node) => fn(...args)(state,node);

//inject node
const api = Object.keys(dom)
  .reduce((acc,fn)=>{
    acc[fn] = stateAndNode(dom[fn]);
    return acc;
}, {});

export default {
  ...api,
  ...list,
  ...math,
  ...logic,
  ...object
};
