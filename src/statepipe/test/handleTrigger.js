import test from "ava"
import handleTrigger from "../handleTrigger"
import statepipe from "../index"
import initTrigger from "../initTrigger"
import utils from "../utils"
import node from "~/test-utils/mock-node"
import window from "~/test-utils/mock-window"
import contexts from "~/test-utils/mock-context"

global.MutationObserver = window.MutationObserver
//global.$statepipeLog = true

const getStoreSchema = (name, store, config) => {
    const wrapper = node({});
    const main = node(Object.assign({
        [utils.STATEPIPE_ATTR] : name,
        [utils.TRIGGER_ATTR]:"hello@click|event:value|pass:loren"
    },config||{}));
    wrapper.setQueryResult([main]);
    const instances = statepipe(wrapper,store);
    return instances[name];
}

test('init', t => {
    t.is("function", typeof handleTrigger)
    t.is(null, handleTrigger())
    t.is(null, handleTrigger({}))
    t.is(null, handleTrigger({},"action"))
    t.is("function", typeof handleTrigger({node:node()},"action"))
})

test('resolve payload for every block', t => {
    let currentAction;
    const store = {
        [utils.TRIGGER_STORE] : {
            "passA": (prop) => {
                t.pass()
                return (payload, event, node) => {
                    t.pass()
                    return {value:"passA"}
                }
            },
            "fail" : (prop) => {
                t.pass()
                return (payload, event, node) => {
                    t.pass()
                    return null
                }
            },
            "passB": (prop) => {
                t.pass()
                return (payload, event, node) => {
                    t.pass()
                    return {value:"passB"}
                }
            },
        }
    }
    const model = contexts.withChildren([
        contexts.element(utils.TRIGGER_ATTR
            ,"go@click|passA,go@click|fail,go@click|passB")
    ]);
    const ctx = statepipe(model.wrapper,store)
    const schema = ctx[model.name].components[0]
    
    initTrigger(schema)
    currentAction = "go";
    let trigger = handleTrigger(schema,currentAction)
    t.plan(8)
    trigger({type:"click"})
    t.is("go", schema.node.getAttribute(utils.ACTION_ATTR))
    t.is(JSON.stringify({value:"passB"}), schema.node.getAttribute(utils.PAYLOAD_ATTR))
})

test('multi actions handle reducer by event type', t => {
  let currentAction;
  const store = {
      [utils.TRIGGER_STORE] : {
          "pass": (prop) => {
              return (payload, event, node) => {
                  t.pass()
                  return {value:prop}
              }
          }
      }
  }
  const model = contexts.withChildren([
      contexts.element(utils.TRIGGER_ATTR
          ,"go@click|pass:click|pass:click,go@click|pass:click,go@change|pass:change,ping@loren|pass:ping")
  ]);
  const ctx = statepipe(model.wrapper,store)
  const schema = ctx[model.name].components[0]
  //global.$statepipeLog = true
  initTrigger(schema)
  currentAction = "go";
  let trigger = handleTrigger(schema, currentAction)

  t.plan(11)
  trigger({type:"click"}) // should pass 3 tests
  t.is("go", schema.node.getAttribute(utils.ACTION_ATTR))
  t.is(JSON.stringify({value:"click"}), schema.node.getAttribute(utils.PAYLOAD_ATTR))

  trigger({type:"change"}) // should pass 1 test
  t.is("go", schema.node.getAttribute(utils.ACTION_ATTR))
  t.is(JSON.stringify({value:"change"}), schema.node.getAttribute(utils.PAYLOAD_ATTR))

  trigger({type:"loren"}) // should pass 1 test
  t.is("ping", schema.node.getAttribute(utils.ACTION_ATTR))
  t.is(JSON.stringify({value:"ping"}), schema.node.getAttribute(utils.PAYLOAD_ATTR))
})

test('missing state', t => {
    const store = {
        [utils.TRIGGER_STORE] : {
            "event": () => {
                t.fail("should not run")
                return () => {
                    t.fail("should not run")
                    return {foo:"bar"}
                }
            }
        }
    }
    let schema = getStoreSchema("nostate",store).components[0]
    let trigger = handleTrigger(schema,"fire")
    trigger({type:"click"})
    t.pass()
})

test('wrong state format', t => {
    const store = {
        [utils.TRIGGER_STORE] : {
            "event": () => {
                t.fail("should not run")
                return () => {
                    t.fail("should not run")
                    return {foo:"bar"}
                }
            }
        }
    }
    let schema = getStoreSchema("wront-format",store,{
        [utils.STATE_ATTR]:"foo"
    }).components[0]
    let trigger = handleTrigger(schema,"fire")
    trigger({type:"click"})
    t.pass()
})

test('produce payload', t => {
    const store = {
        [utils.TRIGGER_STORE] : {
            "event": (prop) => {
                t.is(prop, "value")
                return (payload, event, node) => {
                    t.is("init",payload.value)
                    t.is(true, utils.validateState(payload))
                    t.is(node, schema.node)
                    t.is(event.type, "click")
                    return {foo:"bar"}
                }
            },
            "pass" : (prop) => {
                t.is(prop, "loren")
                return (payload, event, node) => {
                    t.is(true, utils.validateState(payload))
                    t.is("bar",payload.foo);
                    t.is(event.type, "click")
                    t.is("bar",payload.foo)
                    return {result:123}
                }
            }
        }
    }

    const nodeTrigger = getStoreSchema("payload", store, {
        [utils.STATE_ATTR]: JSON.stringify({value:"init"})
    })

    const schema = nodeTrigger.components[0]
    
    initTrigger(schema)
    const trigger = handleTrigger(schema,"hello")
    t.plan(12)
    trigger({type:"click"})
    t.is("hello", schema.node.getAttribute(utils.ACTION_ATTR))
    t.deepEqual(JSON.stringify({result:123}), schema.node.getAttribute(utils.PAYLOAD_ATTR))
})


test('payload multi reducer ', t => {
    let currentAction;
    const store = {
        [utils.TRIGGER_STORE] : {
            "event": (prop) => {
                t.is(prop, currentAction)
                return (payload, event, node) => {
                    t.is(true, utils.validateState(payload))
                    t.is(true, utils.validateState(event))
                    t.is(true, utils.validateNode(node))
                    t.is(true,payload.value)
                    t.is(node, schema.node)
                    return {fromReducer:"event"}
                }
            },
            "pass" : (prop) => {
                t.is(prop, currentAction)
                return (payload, event, node) => {
                    t.is(true, utils.validateState(payload))
                    t.is("event",payload.fromReducer)
                    t.is(true, utils.validateState(event))
                    t.is(true, utils.validateNode(node))
                    return {result:prop}
                }
            }
        }
    }

    const model = contexts.withChildren([
        contexts.element(
            utils.TRIGGER_ATTR,
            "hello@click|event:hello|pass:hello,fire@change|missing|event:fire|pass:fire"
        )
    ]);
    const ctx = statepipe(model.wrapper,store)
    const schema = ctx[model.name].components[0]
    
    t.plan(28)

    initTrigger(schema)
    currentAction = "hello";
    let trigger = handleTrigger(schema,currentAction)
    t.is(5, schema.reducers.length)

    trigger({type:"click"})

    t.is(currentAction, schema.node.getAttribute(utils.ACTION_ATTR))
    t.deepEqual(JSON.stringify({result:currentAction}), schema.node.getAttribute(utils.PAYLOAD_ATTR))

    currentAction = "fire";
    trigger = handleTrigger(schema,currentAction)
    
    //invalid reducer will be disposed after running without store
    t.is(4, schema.reducers.length) 
    
    trigger({type:"change"});
    t.is(currentAction, schema.node.getAttribute(utils.ACTION_ATTR))
    t.deepEqual(JSON.stringify({result:currentAction}), schema.node.getAttribute(utils.PAYLOAD_ATTR))

})
