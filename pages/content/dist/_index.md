---
title: Distributed Versions
description: All statepipe versions and reports.
layout: dist
tags:
    - dist
    - version
versions:
    - version: 0.1.1
      changelog: [
          "**classAdd classRm classToggle**: wont change class when the value is `undefined`"
      ]
      trigger: [eventFn, eventPick, append, concat, drop, dropLast, filter, filterNot, flatten, prepend, reverse, sort, take, takeLast, equals, even, falsy, gt, gte, includes, lt, lte, negative, notEquals, odd, positive, truthy, add, dec, divide, inc, max, min, modulo, multiply, negate, subtract, nodeFn, nodePick, not, pick, pickAll, set]
      pipe:  [append, concat, drop, dropLast, filter, filterNot, flatten, prepend, reverse, sort, take, takeLast, equals, even, falsy, from, gt, gte, includes, lt, lte, negative, notEquals, odd, positive, truthy, add, dec, divide, inc, max, min, modulo, multiply, negate, subtract, nodeFn, nodePick, not, pick, pickAll, set]
      out: [append, concat, drop, dropLast, filter, filterNot, flatten, prepend, reverse, sort, take, takeLast, equals, even, falsy, gt, gte, includes, lt, lte, negative, notEquals, odd, positive, truthy, add, dec, divide, inc, max, min, modulo, multiply, negate, subtract, nodeFn, nodePick, not, pick, pickAll, set, appendChild, attrRm, attrSet, attrToggle, classAdd, classRm, classToggle, prependChild, prop, template, text]

    - version: 0.1.0
      trigger: [eventFn, eventPick, append, concat, drop, dropLast, filter, filterNot, flatten, prepend, reverse, sort, take, takeLast, equals, even, falsy, gt, gte, includes, lt, lte, negative, notEquals, odd, positive, truthy, add, dec, divide, inc, max, min, modulo, multiply, negate, subtract, nodeFn, nodePick, not, pick, pickAll, set]
      pipe:  [append, concat, drop, dropLast, filter, filterNot, flatten, prepend, reverse, sort, take, takeLast, equals, even, falsy, from, gt, gte, includes, lt, lte, negative, notEquals, odd, positive, truthy, add, dec, divide, inc, max, min, modulo, multiply, negate, subtract, nodeFn, nodePick, not, pick, pickAll, set]
      out: [append, concat, drop, dropLast, filter, filterNot, flatten, prepend, reverse, sort, take, takeLast, equals, even, falsy, gt, gte, includes, lt, lte, negative, notEquals, odd, positive, truthy, add, dec, divide, inc, max, min, modulo, multiply, negate, subtract, nodeFn, nodePick, not, pick, pickAll, set, appendChild, attrRm, attrSet, attrToggle, classAdd, classRm, classToggle, prependChild, prop, template, text]
---

## Versions

The standard statepipe dist file includes the core and all documented stores.
 
There is always a slim version for those who want to use only custom reducers.
