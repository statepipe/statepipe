export default fn => (...args) => (ctx) => {
  if (args[0] === "-") {
    args.shift();
    return fn(...args)({...ctx, payload:ctx.state});
  }
  return fn(...args)(ctx);
};
