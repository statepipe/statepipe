//general
import dom from "../src/dom";
import state from "../src/state";
import render from "../src/render";

const pipeIgnorePayload = fn => (...args) => (ctx) => {
  return fn(...args)({
    ...ctx,
    payload:ctx.state || {}
  });
};

let api = {
  ...dom,
  ...state,
  ...render
};

Object
  .keys(api)
  .forEach((reducer) => {
    api[reducer] = pipeIgnorePayload(api[reducer]);
  });

//only for pipes
delete api.from;

export default api;
