---
title: "triggers"
description: The objective of the :trigger is to produce an action.

weigth: 3
tags:
   - trigger
   - action
   - payload
---

{{% hlink h2 "Triggers" %}}

* **Attribute Name**: <mark>:trigger</mark>
* **Objective**: produzir action + payload
* **Store** : `$statepipeStores.trigger`
* **Reducer Context**: `(state, event, node)`
* **Reducers Docs**: [trigger]({{< relref "/docs/trigger" >}})

This is the **only sort of reducer** that require at least 2 reducers at attribute level!

Becasuse trigger are passive and reacts to node events, the first part of the reducer has to be like this: `action@eventBind`

Means that:

* **action**: the name of the action that **will be dispatched** when *eventBind* is fired by the element you placed the <mark>:trigger</mark>.

* **eventBind**: the name of the event that will be listened by that element. `node.addEvetListener(eventBind, handleTrigger);`.

See: 

  * trigger="<mark>hit@click</mark>" 👎 (missing the 2nd reducer)
  * trigger="<mark>hit@click|pickAll</mark>" 👍 
  * trigger="<mark>hit@click|pickAll</mark>,<mark style="background-color:cyan">add@click|pick:id</mark>" 👍 (2 action same event bind)
  * trigger="<mark>hit@click|pickAll</mark>,<mark style="background-color:cyan">add@change|pick:id</mark>" 👍 (2 actions 2 event bind)

There are cases where you can't or shouldn't decorate html attributes.

For those the trigger can also have a special syntax to listen from there.

* **document**: <mark style="background-color:lightgreen">trigger="hit@document.load</mark>
* **documentElement**:  <mark style="background-color:lightgreen">trigger="hit@documentElement.load"</mark>
* **body**:  <mark style="background-color:lightgreen">trigger="hit@body.load"</mark>
* **window**:  <mark style="background-color:lightgreen">trigger="hit@window.load"</mark>

The target from where the action is dispatched can be filtered by [pipe -> from]({{< relref "/docs/pipe#from" >}}) reducer.

They also have an unique class of reducers called [event]({{< relref "/docs/trigger#event" >}}).

{{% continue "/docs/trigger" %}}
