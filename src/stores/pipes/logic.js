import logic from "../src/state/logic";
import ignorePayload from "./ignorePayload";

export default Object
  .keys(logic)
  .reduce((acc,fn)=>{
    acc[fn] = ignorePayload(logic[fn]);
    return acc;
  },{});
