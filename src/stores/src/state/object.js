import {
  set, view, is, not, lensPath
} from "ramda";

const _defaultProp = "value";

const testObject = object => is(Object, object) && not(is(Array, object));
const testProp = prop => prop === undefined || is(String, prop);
const testPayloadAndState = (payload, state) => testObject(payload) && testObject(state);

export default {
  pick: (...args) => ({payload, state}) => {

    if (not(testPayloadAndState(payload, state))) {
      return state;
    }

    args = args.length
      ? args
      : [_defaultProp];

    args
    .filter(testProp)
    .forEach(propName => {
      const lens  = lensPath(propName.split("."));
      const val = view(lens, payload);
      if (val !== undefined && !!lens){
        state = set(lens, val ,state);
      }
    });
    return state;
  },

  pickAll: prop => ({payload, state}) => {
    if (prop === "-"){
      payload = state;
    }
    if (not(testPayloadAndState(payload, state))){
      return state;
    }
    return {
          ...state,
          ...payload
        };
  },

  set: (propA, propB) => ({payload, state, action}) => {
    
    propA = propA || _defaultProp;
    propB = propB || _defaultProp;

    if (not(testPayloadAndState(payload, state))
    || not(testProp(propA) && testProp(propB))
    ) {
      return state;
    }

    if (propA === "$action" && is(String,action)){
      return set(lensPath(propB.split(".")), action, state);
    }

    const lensA  = lensPath(propA.split("."));
    const val = view(lensA, payload);

    if (val === undefined) {
      return state;
    }
    
    return set(lensPath(propB.split(".")), val, state);
  },

  not: (propA, propB) => ({payload, state}) => {
    
    propA = propA || _defaultProp;
    propB = propB || _defaultProp;
    
    if (not(testPayloadAndState(payload, state))
    || not(testProp(propA) && testProp(propB))
    ) {
      return state;
    }

    const val = view(lensPath(propA.split(".")), payload);

    return (val !== undefined) 
      ? set(lensPath(propB.split(".")), not(val), state)
      : state;
  },
};
