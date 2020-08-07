---
title: Reducers
description: Reducers are the heart of the statepipe. They handle payload and state using functional reducers to produce component changes.
layout: single
weight: 2
tags:
    - reducers
    - trigger
    - out
    - pipe
---

{{% hlink h2 Reducers %}}

From the moment an action is created by a trigger to the moment an output is produced, state and payload have to be passed by reducers to produce changes.

Most of the built-in reducers available at statepipe script use {{% ablank "ramda" "https://ramdajs.com/" %}} as a framework to achieve functional reducers.

Each phase of the [workflow]({{< ref "/core/workflow" >}}) have access to a different list of reducers - all placed into the **main store** called `$statepipeStores`

> Check it out by typing `$statepipeStores` at the console.

So it looks like:

* **:trigger** `$statepipeStores.trigger`
* **:pipe** `$statepipeStores.out`
* **:out** `$statepipeStores.pipe`

{{% hlink h2 Syntax %}}

The syntax to create a component is pretty much the same for all phases:

* :pipe="<mark>block</mark>,<mark style="background-color:cyan">block</mark>"
* :trigger="<mark>block</mark>,<mark style="background-color:cyan">block</mark>"
* :out="<mark>block</mark>,<mark style="background-color:cyan">block</mark>"

A *block* is a group os instruction that will be processed by statepipe to that element. To split blocks use `,` (a trigger, could dispatch an action *add-to-cart* and *track-event* when the user click the button).

> The example is using a :pipe but the syntax is the same for :trigger, :pipe and :out!

Inside a *block* we can have as much reducers as we need.

To split reducers we use `|`. 

* :pipe="<mark>from:add-to-cart|append</mark>,<mark style="background-color:cyan">from:track-event|ga</mark>"

We can read the first block *block* <mark>from:add-to-cart|append</mark> as:

1. `from:add-to-cart` - uses the [from]({{< ref "/docs/pipe#from" >}}) reducer sending "*add-to-cart*" as argument to process the payload.
2. `append` - uses the reducer [append]({{< ref "/docs/pipe#append" >}}) to process the result of the previous reducer with the payload.

While a reducer returns a valid state/payload  (not `null`) it will be passed by reducer trough reducer and then the next block will start processing payload and state in the same way.

What changes from [trigger]({{< ref "/docs/trigger" >}}), [pipe]({{< ref "/docs/pipe" >}}) and [out]({{< ref "/docs/out" >}}) is the context where the mutation happened.

This allows accessing different data for each stage of the workflow.

Every reducer run in 2 phases:

{{% hlink h2 "1st Parameter Definition" %}}

This phase is where we tell the reducer what values from payload/state should be accessed to produce the change.

They must return a `Function` - that will be called at the [Execution](#2nd-execution) phase.

The syntax is:

`reducerName:arg1:arg2:argN`

The store at `reducerName` must return a function

`(...args) => Function`

Consider the following: "<mark>dec:stock</mark>|<mark style="background-color:cyan">pick:sku:name:price</mark>"

Means that:

* **dec** is getting `stock` as argument.
  
    `const runTrigger = dec("stock");`
  
* **pick** is getting `sku,name,price` as argument.

    `const runTrigger = pick("sku,name,price");`

> Most of the built-in reducers will consider that the first argument, by default, is "value". Your code will get slimmer and easy to read in most cases if you dont place them. Ex: `:out="truthy:value|add:value"` is the same as `:out="truthy|add"` 

{{% hlink h2 "2nd Execution" %}}

Each phase of the workflow has a goal hence access to different data on each.

To understand properly what each reducer will consume during its execution phase, check the [docs](/docs/).

At this phase the reducer **must return**: `state` or `null`.

If the result is a valid `Object`, the reducer will be called otherwise interrupted! 

> Check the **logic reducers** ([trigger](/docs/trigger#logic), [pipe](/docs/pipe#logic), [out](/docs/out#logic)) and see how they take advantage of sending `null` results!

{{% hlink h3 "Trigger context" %}}

The function returned by [1st phase](#1st-parameter-definition) will be called with the following arguments:

`(state, event, node) => state`

Consider the following

trigger="<mark>eventFn:preventDefault</mark>|<mark style="background-color:cyan">dec:total</mark>|<mark style="background-color:lightgreen">nodePick</mark>"

Means that:

* **eventFn:preventDefault** 

    ```
    const fn = eventFn("preventDefault");
    fn(state,event,node) // event.preventDefault();
    return state;
    ```
* **dec:total** 

    ```
    const fn = dec("total");
    fn(state,event,node) // state.total = dec(state.total);
    return state;
    ```

* **nodePick** 

    ```
    const fn = nodePick();
    fn(state,event,node) // state.value = node.value;
    return state;
    ```

{{% continue "/core/triggers" %}}

{{% hlink h3 "Pipe context" %}}

The function returned by [1st phase](#1st-parameter-definition) will be called with the following arguments:

`(payload, state, action, node, actioOriginNode) => state`

Consider the following

:pipe="<mark>from:add</mark>|<mark style="background-color:cyan">add:price:total</mark>"

Means that:

* **from:add** 

  ```
  const fn = from("add");
  fn(payload, state, action, node, origin)
  return (action == "add" ) state : null;
  ```

* **add:price:total** 

  ```
  const fn = add("price","total");
  fn(state,event,node)
  state.total = add(payload.price, state.total);
  return state;
  ```

{{% continue "/core/pipes" %}}

{{% hlink h3 "Output context" %}}

The function returned by [1st phase](#1st-parameter-definition) will be called with the following arguments:

`(state, node) => state`

Consider the following:

:out="<mark>fnRun:self:blur</mark>|<mark style="background-color:cyan">text</mark>"

* **fnRun:self:blur** 

  ```
  const fn = fnRun("self","blur");
  fn(state,node) // node.blur();
  return state;
  ```
* **text** 

  ```
  node.textContent = state.value;
  return state;
  ```
  
{{% continue "/core/output" %}}
