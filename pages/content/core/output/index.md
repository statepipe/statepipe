---
title: "output"
description: The objective of the :out is to produce changes at the element level (css, text, new nodes).
weigth: 5
tags:
    - out
    - output
---

{{% hlink h2 "Output" %}}

* **Attribute Name**: <mark>:out</mark>
* **Objective**: produce changes at the element level (css, text, new nodes)
* **Store** : `$statepipeStores.out`
* **Reducer Context**: `(state, node)`
* **Reducers Docs**: [out]({{< relref "/docs/out" >}})

They have an unique class of reducers called [render]({{< relref "/docs/out#render" >}}).

These reducers can change the element in many different ways: textContent, innerHTML, setAttribute, class , and etc.

Another feature is that - by default - new nodes from innerHTML changes ([template]({{< relref "/docs/out#template" >}}), [appendChild]({{< relref "/docs/out#appendChild" >}}) etc) will be serialized by statepipe work with the others from that context!

Check this behaviorat [todo-list]({{< relref "/examples/todo-list" >}}) example!

{{% continue "/docs/out" %}}
