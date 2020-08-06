import test from "ava"
import statepipe from "../index"
import node from "~/test-utils/mock-node"
import window from "~/test-utils/mock-window"
import contexts from "~/test-utils/mock-context"
import utils from "~/src/statepipe/utils"

global.window  = window
global.MutationObserver = window.MutationObserver
//global.$statepipeLog = true;

test('statepipe invalid start', t => {
  t.is("function", typeof statepipe) 
  t.is(null, statepipe());
  t.is(null, statepipe(window));
  t.is(null, statepipe("a",{}));
  t.is(null, statepipe(function(){},{}));
  t.is(null, statepipe(1,{}));
  t.is(null, statepipe({},{}));
});

test('statepipe empty wrapper', t => {
  window.setAttribute(utils.STATEPIPE_ATTR, "empty-wrapper");
  t.deepEqual({}, statepipe(window,{}));
});

test('statepipe wrapper with children but no compoments', t => {
  window.setAttribute(utils.STATEPIPE_ATTR, "no-components");
  window.setQueryResult([node(),node()]);
  t.is(null, statepipe(window,function(){}))
  t.deepEqual({}, statepipe(window,{}));
});

test('statepipe wrapper with store', t => {
  const context = contexts.simple();
  const instances = statepipe(context.wrapper,{});
  t.is("object", typeof instances)
  t.is("object", typeof instances[context.name])
  const i = instances[context.name];
  t.is(true, Array.isArray(i.components))
  t.is(3, i.components.length);
});

test('statepipe wrapper with components children', t => {
  const context = contexts.withChildren([
    contexts.element(utils.OUT_ATTR, "text"),
    contexts.element(utils.TRIGGER_ATTR, "ping@click|pick"),
    contexts.element(utils.PIPE_ATTR, "set")
  ]);
  const instances = statepipe(context.wrapper,{});
  t.is("object", typeof instances)
  t.is("object", typeof instances[context.name])
  const i = instances[context.name];
  t.is(true, Array.isArray(i.components))
  t.is(3, i.components.length);
});

test('statepipe multi wrapper', t => {
  const main = node({});
  
  const w1 = node({
    [utils.STATEPIPE_ATTR]:"wrapper-header",
    [utils.PIPE_ATTR]:"pick|inc",
  });
  w1.setQueryResult([contexts.element(utils.TRIGGER_ATTR, "ping@click|inc|pass|add")])
  
  const w2 = node({[utils.STATEPIPE_ATTR]:"wrapper-footer"});
  w2.setQueryResult([
    contexts.element(utils.TRIGGER_ATTR, "ping@click|pick,fail,track@click|pickAll"),
    contexts.element(utils.OUT_ATTR, "text:value"),
    contexts.element(utils.PIPE_ATTR, "pick:a:b"),
  ])
  
  main.setQueryResult([w1, w2])
  
  const instances = statepipe(main,{});
  t.is("object", typeof instances)
  t.is("object", typeof instances["wrapper-footer"])
  t.is("object", typeof instances["wrapper-header"])
  
  const header = instances["wrapper-header"];
  
  t.is(true, Array.isArray(header.components))
  t.is(2, header.components.length);
  
  t.is(utils.PIPE_STORE, header.components[0].type);
  t.is(2, header.components[0].reducers.length);
  
  t.is(utils.TRIGGER_STORE, header.components[1].type);
  t.is(3, header.components[1].reducers.length);

  const footer = instances["wrapper-footer"];
  
  t.is(true, Array.isArray(footer.components))
  t.is(3, footer.components.length);
  t.is(utils.TRIGGER_STORE, footer.components[0].type);
  t.is(utils.OUT_STORE, footer.components[1].type);
  t.is(utils.PIPE_STORE, footer.components[2].type);

  t.is(2, footer.components[0].reducers.length);
  t.is("pick", footer.components[0].reducers[0].fn);
  t.is("ping", footer.components[0].reducers[0].action);
  t.is("pickAll", footer.components[0].reducers[1].fn);
  t.is("track", footer.components[0].reducers[1].action);

  t.is("text", footer.components[1].reducers[0].fn);
  t.deepEqual(["value"], footer.components[1].reducers[0].args);
  
  t.is("pick", footer.components[2].reducers[0].fn);
  t.deepEqual(["a","b"], footer.components[2].reducers[0].args);
});
