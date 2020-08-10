import math from "./state/math";
import object from "./state/object";
import logic from "./state/logic";
import list from "./state/list";
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
