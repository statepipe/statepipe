export const unexpectedParams = (testRunner, rdcr ) => {
  const empty  = {a:1}

  testRunner.is("function", typeof rdcr());
  testRunner.is("function", typeof rdcr("value"));
  testRunner.is("function", typeof rdcr(null));
  testRunner.is("function", typeof rdcr(1));
  testRunner.is("function", typeof rdcr(function(){}));
}
