import test from "ava"
import math from "../math"
import object from "../object"
import list from "../list"
import logic from "../logic"
import dom from "../dom"
import render from "../render"

const unexpectedParams = (testRunner, rdcr ) => {
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

const ignoreStateType = (testRunner, rdcr) =>{
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

Object
  .keys(math)
  .forEach(fn => {
    test(`stores:src/ math testUnexpectedParams ${fn}` , t => {
      unexpectedParams(t, math[fn])
    })
  })

Object
  .keys(object)
  .forEach(fn => {
    test(`stores:src/ object testUnexpectedParams ${fn}` , t => {
      unexpectedParams(t, object[fn])
    })
  })
  
Object
  .keys(list)
  .forEach(fn => {
    test(`stores:src/ list testUnexpectedParams ${fn}` , t => {
      unexpectedParams(t, list[fn])
    })
  })

Object
  .keys(dom)
  .forEach(fn => {
    test(`stores:src/ dom testUnexpectedParams ${fn}` , t => {
      ignoreStateType(t,dom[fn])
    })
  })

Object
  .keys(logic)
  .forEach(fn => {
    test(`stores:src/ logic testUnexpectedParams ${fn}` , t => {
      const rdcr = logic[fn];
      t.is("function", typeof rdcr());
      t.is("function", typeof rdcr("value"));
      t.is("function", typeof rdcr(null));
      t.is("function", typeof rdcr(1));
      t.is("function", typeof rdcr(function(){}));

      t.falsy(rdcr()(null))
      t.falsy(rdcr()(undefined))
      t.falsy(rdcr()("1"))
      t.falsy(rdcr()(true))
      t.falsy(rdcr()(function(){}))
      t.falsy(rdcr()({}))
    })
  })

Object
  .keys(render)
  .forEach(fn => {
    test(`stores:src/ render testUnexpectedParams ${fn}` , t => {
      ignoreStateType(t,render[fn])
    })
  })

  
