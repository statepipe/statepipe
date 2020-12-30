//general
import dom from "../src/dom";
import state from "../src/state";

const pipeIgnorePayload = fn => (...args) => (ctx) => {
  return fn(...args)({
    ...ctx,
    payload:ctx.state || {}
  });
};

let api = { ...dom, ...state};

Object
  .keys(api)
  .forEach(reducer => {
    api[reducer] = pipeIgnorePayload(api[reducer]);
    });

//only for pipes
delete api.from;

export default api;
