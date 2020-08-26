import test from "ava";
import statepipe from "../index";
import utils from "../utils";
import handleState from '../handleState';
import window from "~/test-utils/mock-window";
import contexts from "~/test-utils/mock-context";

global.MutationObserver = window.MutationObserver

test('handleState/ arguments', t => {
    t.is("function", typeof handleState) 
    t.is(null, handleState()) 
    t.is(null, handleState(1)) 
    t.is(null, handleState({})) 
    t.is(null, handleState(function(){})) 
})

test('handleState/ args and context', t => {
  //global.$statepipeLog = true;
  const config = contexts.simple();
  let ctx;
  
  const sp = statepipe(config.wrapper, {
      [utils.OUT_STORE]:{
          text: (value) => {
              t.is("value", value);
              return (context) => {
                  t.is(true, utils.validateState(context.state))
                  t.is(context.node, ctx.components[0].node)
                  t.is(context.wrapper, ctx.components[0].wrapper)
                  return {value:value}
              }
          }
      }
  });
  ctx = sp[config.name];

  t.plan(5)
  handleState(ctx.components[0])
  t.is(JSON.stringify({value:"sample"}),
    ctx.components[0].node.getAttribute(utils.STATE_ATTR))
})

test('handleState/ produce output', t => {
    //global.$statepipeLog = true;
    const config = contexts.simple();
    let ctx;
    
    const sp = statepipe(config.wrapper, {
        [utils.OUT_STORE]:{
            text: (value) => {
                t.is("value", value);
                return ({state, node}) => {
                    t.is(true, utils.validateState(state))
                    t.is(true, node === ctx.wrapper)
                    return {value:value}
                }
            }
        }
    });
    ctx = sp[config.name];

    t.plan(4)
    handleState(ctx.components[0])
    t.is(JSON.stringify({value:"sample"}),
      ctx.components[0].node.getAttribute(utils.STATE_ATTR))
})

test('handleState/ missing store reducer', t => {
    const config = contexts.withChildren([
        contexts.element(utils.OUT_ATTR, "set:foo|error|pass:true"),
      ]);
      let ctx;
      
      const sp = statepipe(config.wrapper, {
          [utils.OUT_STORE]:{
              set: value => {
                  return ({state}) => {
                      t.is(true, state.value)
                      t.pass()
                      return {value:value}
                  }
              },
              pass: (value) => {
                return ({state}) => {
                    t.is("foo", state.value)
                    t.pass()
                    return {value:value}
                }
            }
          }
      });
      ctx = sp[config.name];
      
      t.plan(6)
      handleState(ctx.components[0])
      t.is(2,ctx.components[0].reducers.length)
      t.is(JSON.stringify({value:true}),
        ctx.components[0].node.getAttribute(utils.STATE_ATTR))
})

test('handleState/ malformed state', t => {
    //global.$statepipeLog = true;
    const config = contexts.simple();
    let ctx;
    
    const sp = statepipe(config.wrapper, {
        [utils.OUT_STORE]:{
            text: (value) => {
                t.fail()
                return () => {
                    t.fail()
                    return {value:value}
                }
            }
        }
    });
    ctx = sp[config.name];

    t.plan(3)
    ctx.components[0].node.setAttribute(utils.STATE_ATTR, "-")
    handleState(ctx.components[0])
    t.is("-",ctx.components[0].node.getAttribute(utils.STATE_ATTR))

    ctx.components[0].node.setAttribute(utils.STATE_ATTR, null)
    handleState(ctx.components[0])
    t.is(null,ctx.components[0].node.getAttribute(utils.STATE_ATTR))

    ctx.components[0].node.setAttribute(utils.STATE_ATTR, "[]")
    handleState(ctx.components[0])
    t.is("[]",ctx.components[0].node.getAttribute(utils.STATE_ATTR))
})

test('handleState/ handle reducer error', t => {
    const config = contexts.withChildren([
        contexts.element(utils.OUT_ATTR,"text:pass|fail")
    ]);
    let ctx;
    
    const sp = statepipe(config.wrapper, {
        [utils.OUT_STORE]:{
            text: (value) => {
                t.is("pass", value);
                return ({state, node}) => {
                    t.is(true, node === ctx.components[0].node)
                    return {value:value}
                }
            },
            fail: () => {
                t.pass()
                return ({state}) => {
                    t.is("pass",state.value)
                    throw new Error("wont pass")
                }
            }
        }
    });
    ctx = sp[config.name];

    t.plan(4)   
    handleState(ctx.components[0])
})

test('handleState/ handle malformed reducer function', t => {
    const config = contexts.withChildren([
        contexts.element(utils.OUT_ATTR,"text:pass")
    ]);
    let ctx;
    
    const sp = statepipe(config.wrapper, {
        [utils.OUT_STORE]:{
            text: (value) => {
                t.is("pass", value);
            }        
        }
    });
    ctx = sp[config.name];

    t.plan(2)   
    handleState(ctx.components[0])
    handleState(ctx.components[0])
})

test('handleState/ preserve state btw reducers', t => {
    const config = contexts.withChildren([
        contexts.element(utils.OUT_ATTR,"text:pass|break|render")
    ]);
    
    const sp = statepipe(config.wrapper, {
        [utils.OUT_STORE]:{
            text: (value) => {
                t.is("pass", value);
                return () => {
                    t.pass()
                    return {value:value}
                }
            },
            break: () => {
                t.pass()
                return ({state}) => {
                    t.is("pass", state.value);
                    return null
                }
            },
            render: () => {
                t.fail()
                return () => {
                    t.fail()
                    return null
                }
            }        
        }
    });
    let ctx = sp[config.name];

    t.plan(4)   
    handleState(ctx.components[0])  
})

test('handleState/ preserve state btw blocks', t => {
    const config = contexts.withChildren([
        contexts.element(utils.OUT_ATTR,"text:pass,break,render")
    ]);
    
    const sp = statepipe(config.wrapper, {
        [utils.OUT_STORE]:{
            text: (value) => {
                t.is("pass", value);
                return ({state}) => {
                    t.is(true, state.value);
                    return {value:value}
                }
            },
            break: (value) => {
                t.is(undefined, value)
                return ({state}) => {
                    t.is(true, state.value);
                    return null
                }
            },
            render: () => {
                t.pass()
                return ({state}) => {
                    t.is(true, state.value)
                    return null
                }
            }        
        }
    });
    let ctx = sp[config.name];

    t.plan(6)   
    handleState(ctx.components[0])
})
