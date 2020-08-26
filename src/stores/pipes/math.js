
import math from "../src/state/math";
import ignorePayload from "./_ignorePayload";

const persistA = fn => (a,b,c,d) => (ctx) => {
  if (a === "-"){
    d = c;
    c = b;
  }
  return ignorePayload(fn)(a,b,c,d)(ctx);
};

export default {
  add : ignorePayload(math.add),
  subtract : ignorePayload(math.subtract),
  divide : ignorePayload(math.divide),
  multiply : ignorePayload(math.multiply),
  max : ignorePayload(math.max),
  min : ignorePayload(math.min),
  modulo: ignorePayload(math.modulo),
  dec : persistA(math.dec),
  inc : persistA(math.inc),
  negate : persistA(math.negate)
};
