---
title: todo list
description: the statepipe way for todomvc.com
---

{{% hlink h2 "todo list" %}}

<a href="http://todomvc.com/" target="_blank" >todomvc.com</a> is a hub of many different frameworks solvind the same problem: a todo list.

The following example is the how we can get that problem solved with only built-in reducers.

<small>

**Reducers**

{{% reducer-docs "trigger" "nodePick,eventPick,pickAll,equals,truthy" %}}
{{% reducer-docs "pipe" "from,pickAll,pick,inc,dec,truthy,falsy" %}}
{{% reducer-docs "out" "equals,nodeFn,truthy,classAdd,falsy,classRm,prop,attrSet" %}}

</small>

{{< partial "examples/todo-list"/ >}}
