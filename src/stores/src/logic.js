import {
  includes, gt, gte, lt, lte, 
  view, lensPath, not, is, equals
} from "ramda";

const _value = "value";
const validateState = value => is(Object,value) && not(is(Array,value));
const validateProp = value => is(String, value) && value.length > 0;

const fnLogic = logic => (propA, propB) => (payload, state) => {
  
  propA = propA || _value;
  propB = propB || _value;

  if (not(validateState(state))
  || not(validateState(payload))
  || not(validateProp(propA))
  || not(validateProp(propB))
  ){
    return null;
  }

  const vA = view(lensPath(propA.split(".")), payload);
  const vB = view(lensPath(propB.split(".")), state);

  return vA !== undefined && vB !== undefined
    ? (logic(vA, vB) ? state : null)
    : null;
};


const fnTruthy = (propA,propB) => (payload, state) => {
  propA = propA || _value;
  propB = propB || _value;

  if (not(validateState(payload))
  || not(validateState(state))
  || not(validateProp(propA))
  || not(validateProp(propB))
  ) { 
    return null;
  }

  const vA = view(lensPath(propA.split(".")), payload);

  return  (vA != null 
    && vA !== undefined 
    && vA != 0 
    && vA != false) ? state : null;
};

const fromFilter = (pAction, pSelf, pCtx) => {
    
  pAction = pAction || "*";
  pSelf = pSelf || "*";
  pCtx = pCtx || "*";

  return (payload, state, action, self, origin) => {

    if (not(validateState(state))
    || not(is(String,pAction))
    || not(is(String,pSelf))
    || not(is(String,pCtx))
    || not(action)
    || not(self)
    || not(origin)) {
      return state;
    }

    if (pAction != "*" && action !== pAction ) {
      return null;
    }

    if (pSelf != "*"){
      if (pSelf === "$self" && self != origin){
        return null;
      }
      else if (pSelf === "$others" && self === origin){
        return null;
      }
      else if (not(pSelf.match(/^\$(self|others)$/))) {
        try {
          const match = Array
            .from(document.body.querySelectorAll(pSelf))
            .filter(n => n === origin)
            .length;
          if (!match) {
            return null;
          }
        } catch (_) {
          return null;
        }
      }
    }

    if (pCtx != "*") {
      if (not(self.statepipe) || not(origin.statepipe)) {
        return null;
      }
      else if (pCtx === "$self" && self.statepipe != origin.statepipe) {
        return null;
      }
      else if (pCtx === "$others" && self.statepipe === origin.statepipe) {
        return null;
      }
      else if (not(pCtx.match(/^\$(self|others)$/))
      && pCtx !== origin.statepipe) {
        return null;
      }
    } 

    return state;
  };
};

export default {
  gt : fnLogic(gt),
  gte : fnLogic(gte),
  lt : fnLogic(lt),
  lte : fnLogic(lte),
  equals : fnLogic(equals),
  includes : fnLogic(includes),
  notEquals : fnLogic((a,b)=> a !== undefined && b !== undefined && a !== b),
  truthy: fnTruthy,
  falsy: a => (payload, state) => fnTruthy(a)(payload, state) === state ? null : state,
  odd: fnLogic( a => not(isNaN(a)) ? a % 2 !== 0 : false),
  even: fnLogic(a => not(isNaN(a)) ? a % 2 === 0 : false),
  positive : fnLogic(a => not(isNaN(a)) ? a >= 0 : false),
  negative: fnLogic(a => not(isNaN(a)) ? a < 0 : false),
  from: fromFilter
};
