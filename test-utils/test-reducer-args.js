export const unexpectedParams = (testRunner, rdcr ) => {
  const empty  = {a:1}

  testRunner.is("function", typeof rdcr());
  testRunner.is("function", typeof rdcr("value"));
  testRunner.is("function", typeof rdcr(null));
  testRunner.is("function", typeof rdcr(1));
  testRunner.is("function", typeof rdcr(function(){}));

  testRunner.falsy(rdcr()(null))
  testRunner.falsy(rdcr()(undefined))
  testRunner.falsy(rdcr()("1"))
  testRunner.falsy(rdcr()(true))
  testRunner.falsy(rdcr()(function(){}))
  testRunner.falsy(rdcr()(empty))

  testRunner.deepEqual(empty, rdcr()(empty,empty))
  testRunner.deepEqual(empty, rdcr()(undefined,empty))
  testRunner.deepEqual(empty, rdcr()("1",empty))
  testRunner.deepEqual(empty, rdcr()(true,empty))

  testRunner.deepEqual(empty, rdcr()(empty,empty,empty))
  testRunner.deepEqual(empty, rdcr()(undefined,empty,empty))
  testRunner.deepEqual(empty, rdcr()("1",empty,empty))
  testRunner.deepEqual(empty, rdcr()(true,empty,empty))
}

export const ignoreStateType = (testRunner, rdcr) =>{
  testRunner.is("function", typeof rdcr());
  testRunner.is("function", typeof rdcr("value"));
  testRunner.is("function", typeof rdcr(null));
  testRunner.is("function", typeof rdcr(1));
  testRunner.is("function", typeof rdcr(function(){}));

  testRunner.is(null,rdcr()(null))
  testRunner.is(undefined, rdcr()(undefined))
  testRunner.is("1", rdcr()("1"))
  testRunner.is(true,rdcr()(true))
}
