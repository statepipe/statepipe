import {
  includes, gt, gte, lt, lte, 
  view, lensPath, not, is, equals
} from "ramda";

const _value = "value";
const validateState = value => is(Object,value) && not(is(Array,value));
const validateProp = value => is(String, value) && value.length > 0;

const fnLogic = logic => (propA, propB) => ({payload, state}) => {
  
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

  return vA !== undefined ? (logic(vA, vB) ? state : null) : null;
};


const fnTruthy = (propA,propB) => ({payload, state}) => {
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

  return ({state, action, node, origin}) => {

    if (not(validateState(state))
    || not(is(String,pAction))
    || not(is(String,pSelf))
    || not(is(String,pCtx))
    || not(action)
    || not(node)
    || not(origin)) {
      return state;
    }

    if (pAction != "*" && action !== pAction ) {
      return null;
    }

    if (pSelf != "*"){
      if (pSelf === "$self" && node != origin){
        return null;
      }
      else if (pSelf === "$others" && node === origin){
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
      if (not(node.statepipe) || not(origin.statepipe)) {
        return null;
      }
      else if (pCtx === "$self" && node.statepipe != origin.statepipe) {
        return null;
      }
      else if (pCtx === "$others" && node.statepipe === origin.statepipe) {
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

const _gt = fnLogic(gt);
const _gte = fnLogic(gte);
const _lt = fnLogic(lt);
const _lte = fnLogic(lte);
const _equals = fnLogic(equals);
const _notEquals = fnLogic((a,b)=> a !== undefined && b !== undefined && a !== b);
const _includes = fnLogic(includes);
const _notIncludes = (...args) => ({payload, state}) => fnLogic(includes)(...args)({payload, state}) === state ? null : state;
const _odd = fnLogic(a => not(isNaN(a)) ? a % 2 !== 0 : false);
const _even = fnLogic(a => not(isNaN(a)) ? a % 2 === 0 : false);
const _positive = fnLogic(a => not(isNaN(a)) ? a >= 0 : false);
const _negative = fnLogic(a => not(isNaN(a)) ? a < 0 : false);
const _truthy = fnTruthy;
const _falsy = a => ({payload, state}) => fnTruthy(a)({payload, state}) === state ? null : state;
const _from = fromFilter;

export default {
  gt: _gt,
  gte: _gte,
  lt: _lt,
  lte: _lte,
  equals: _equals,
  notEquals: _notEquals,
  includes: _includes,
  notIncludes: _notIncludes,
  odd: _odd,
  even: _even,
  positive: _positive,
  negative: _negative,
  truthy: _truthy,
  falsy: _falsy,
  from: _from,
};
