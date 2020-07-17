---
title: todo list
description: exemplo reproduzindo todomvc via statepipe
---

{{% hlink h2 "todo list" %}}

<a href="http://todomvc.com/" target="_blank" >todomvc.com</a> é um acervo que mostra como resolver o mesmo problema (Todo List) em diferentes frameworks.

Esse exemplo foi inspirado nesse projeto.

<small>

**Reducers**

{{% reducer-docs "trigger" "nodePick,eventPick,pickAll,equals,truthy" %}}
{{% reducer-docs "pipe" "from,pickAll,pick,inc,dec,truthy,falsy" %}}
{{% reducer-docs "out" "equals,nodeFn,truthy,classAdd,falsy,classRm,prop,attrSet" %}}

</small>

{{< partial "examples/todo-list"/ >}}
