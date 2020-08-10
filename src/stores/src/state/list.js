import {
  not, is, view, append, curry, concat,
  compose, flatten, drop, dropLast, 
  reverse, equals, filter, lensPath,
  prepend, set, take, takeLast
} from "ramda";

const _v = "value";

const isList = value => is(Array, value) || is(String, value);

const onlyOBject = object => is(Object, object)
  && not(is(Array, object));

const check = (prop, object) => onlyOBject(object)
  && (is(String, prop) || (prop === undefined));

const checkAB = (pA, pB, payload, state) => check(pA, payload)
  && check(pB, state);

const getLens = prop => lensPath((prop ||"").split("."));

const lensValue = (prop, object) => view(getLens(prop), object);

const fnFirstNumber = fn => (pA, pB, pC) => (payload, state) => {
  
  pA = parseInt(pA);
  pB = pB || _v;
  pC = pC || _v;

  if (not((onlyOBject(state) && onlyOBject(payload)))
  || not(is(String, pB))
  || not(Number.isInteger(pA))
  ){
    return state;
  } 

  const list = lensValue(pB, payload);
  
  return isList(list)
    ? set(getLens(pC), fn(pA, list), state)
    : state;
};

const fnAppPrepp = fn => (pA, pB, pC) => (payload, state) => {

  pA = pA || _v;
  pB = pB || _v;
  pC = pC || pB;

  if (not(checkAB(pA, pB, payload, state))) {
    return state;
  }
  
  const val = lensValue(pA, payload);
  const list = lensValue(pB, state);

  return isList(list)
    ? set(getLens(pC), fn(val, list), state)
    : state;
  };

const fnRevFlat = fn => (pA, pB) => (payload, state) => {
  
  pA = pA || _v;
  pB = pB || _v;

  if (not(checkAB(pA, pB, payload, state))) {
    return state;
  }

  const list = lensValue(pA, payload);
  return isList(list)
    ? set(getLens(pB), fn(list), state)
    : state;
};

const fnConcat = (pA, pB, pC) => (payload, state) => {
  
  pA = pA || _v;
  pB = pB || _v;
  pC = pC || pB;
  
  if (not(checkAB(pA, pB, payload, state))) {
    return state;
  }
  
  const pList = lensValue(pA, payload);
  const sList = lensValue(pB, state);
  
  return isList(pList)
    && isList(sList)
    && (typeof pList === typeof sList)
      ? set(getLens(pC), concat(sList,pList), state)
      : state;
};

const fnFilter = fn => (pA, pB, pC) => (payload, state) => {

  pA = pA || _v;
  pB = pB || _v;
  pC = pC || pB;
  
  if (not(checkAB(pA, pB, payload, state))) {
    return state;
  }

  const containsValue = lensValue(pA, payload);
  const array = lensValue(pB, state);

  return is(Array, array) && containsValue !== undefined
    ? set(getLens(pC), filter(fn(containsValue), array), state)
    : state;
};

const fnSort =(pA, pB) => (payload, state) => {
    
  pA = pA || _v;
  pB = pB || _v;

  if (not(checkAB(pA, pB, payload, state))) {
    return state;
  }

  const list = lensValue(pA, payload);

  return is(Array, list)
    ? set(getLens(pB), list.sort(), state)
    : state;
};

export default {
  take: fnFirstNumber(take),
  takeLast: fnFirstNumber(takeLast),
  drop: fnFirstNumber(drop),
  dropLast: fnFirstNumber(dropLast),

  append: fnAppPrepp(append),
  prepend: fnAppPrepp(prepend),

  reverse: fnRevFlat(reverse),
  flatten: fnRevFlat(flatten),
  
  concat: fnConcat,

  filter: fnFilter(equals),
  filterNot: fnFilter(curry((compare, val) => compose(not,equals(compare))(val))),
  sort: fnSort
};
