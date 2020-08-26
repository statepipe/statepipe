import {
  add, subtract,
  dec, inc,
  divide, multiply,
  max, min,negate,modulo,
  is, set,lensPath, view, not
} from "ramda";

const checkData = (payload, state) => is(Object, payload)
  && not(is(Array, payload))
  && not(is(Array, state))
  && is(Object, payload)
  && is(Object, state);

const checkProp = a => is(String, a) && !!a.length;

const math = fn => (pA, pB, pC) => ({payload, state}) => {

  pA = pA || "value";
  pB = pB || "value";
  pC = pC || pB;
  
  if (not(checkData(payload, state))
  || not(checkProp(pA) && checkProp(pB) && checkProp(pC))
  || not(Object.keys(payload).length)
  ) {
    return state;
  }

  const vA = parseFloat(view(lensPath(pA.split(".")), payload));
  const vB = parseFloat(view(lensPath(pB.split(".")), state));
  const res = fn(vA, vB);
  return (Number.isFinite(res))
    ? set(lensPath(pC.split(".")), res, state)
    : state;
};

export default {
  add : math(add),
  subtract : math(subtract),
  divide : math(divide),
  multiply : math(multiply),
  max : math(max),
  min : math(min),
  dec : math(dec),
  inc : math(inc),
  negate : math(negate),
  modulo: math(modulo)
};
