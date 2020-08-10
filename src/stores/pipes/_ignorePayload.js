export default fn => (...args) => (payload, state, action, self, ctx) => {
  if (args[0] === "-") {
    args.shift();
    return fn(...args)(state, state);
  }
  return fn(...args)(payload, state, action, self, ctx);
};
