import {unexpectedParams} from "~/test-utils/test-reducer-args"
import dom from "../index";
import test from "ava"

Object
  .keys(dom)
  .forEach(fn => {
    test(`dom testUnexpectedParams ${fn}` , t => {
      unexpectedParams(t,dom[fn])
    })
  })
