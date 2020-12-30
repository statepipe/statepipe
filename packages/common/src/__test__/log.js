import {log, warn, error} from '../index';

test('log,warn,error', () => {
  const CLOG = console.log;
  const CWARN = console.warn;
  const CERR = console.error;

  let logCount = 0;
  window.$statepipeLog = false;
  console.log = (msg, val) => {
    logCount++;
    expect(logCount).toBe(val);
  };

  let logWarn = 0;
  console.warn = (msg, val) => {
    logWarn++;
    expect(logWarn).toBe(val);
  };

  let logErr = 0;
  console.error = (msg, val) => {
    logErr++;
    expect(logErr).toBe(val);
  };

  log('foo', 0);
  warn('foo', 0);
  error('foo', 0);

  window.$statepipeLog = true;
  log('foo', 1);
  warn('foo', 1);
  error('foo', 1);

  console.log = CLOG;
  console.error = CERR;
  console.warn = CWARN;
});
