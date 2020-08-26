//general
import dom from "../src/dom";
import state from "../src/state";

const pipeIgnorePayload = fn => ({state}) => {
  return fn({payload:state, state});
};

let api = Object
  .keys(api)
  .reduce((api, reducer)=>{
    api = Object.keys(reducer).reduce((acc,fn) => {
      acc[fn] = pipeIgnorePayload(reducer[fn]);
      return acc;
    },api);
    return api;
  }, {
    ...dom,
    ...state
  });

//only for pipes
delete api.from;

export default api;
