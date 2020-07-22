---
title: Pipe
description: The objective of the :pipe is to produce new states
weight: 4
tags:
    - pipe
---

{{% hlink h2 "Pipes" %}}

* **Attribute Name**: <mark>:pipe</mark>
* **Objective**: produce new states
* **Store** : `$statepipeStores.pipe`
* **Reducer Context**: `(payload, state, action, node, actionOriginNode)`
* **Reducers Docs**: [pipe]({{< relref "/docs/pipe" >}})

They have an unique class of reducers called [from]({{< relref "/docs/out#render" >}}) that allows filtering actions and its origin in many different ways. Check [here]({{< ref "/examples/filter-and-contexts" >}}).

{{% continue "/docs/pipe" %}}
