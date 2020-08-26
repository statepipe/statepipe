import object from "../src/state/object";

export default {
  pick: (...args) => ({payload, state}) => {
    if (args[0] === "-"){
      args.shift(0,1);
      payload = state;
      state = {};
    }
    return object.pick(...args)({payload,state});
  },

  pickAll: prop => ({payload, state}) => {
    if (prop === "-"){
      payload = state;
    }
    return object.pickAll(prop)({payload, state});
  },

  set: (propA, propB, propC) => ({payload, state, action}) => {
    if (propA === "-"){
      propA = propB;
      propB = propC;
      payload = state;
    }
    return object.set(propA, propB)({payload, state, action});
  },

  not: (propA, propB, propC) => ({payload, state}) => {
    if (propA === "-"){
      propA = propB;
      propB = propC || propB;
      payload = state;
    }
    return object.not(propA, propB)({payload, state});
  },
};
