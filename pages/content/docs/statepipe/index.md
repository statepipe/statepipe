---
title: :statepipe
description: starting statepipe
weight: 5
tags: 
    - statepipe
    - docs
---

## :statepipe api

The target of statepipe is that everything should be done at the html as attributes.

As soon as the script is loaded on the page a few global variables:

* **$statepipe(wrapper, stores)** `Function`.

    * `wrapper` any html element on the page. From wrapper in, statepipe will search for `:statepipe="name"` to define a new **context** and start looking into that contenxt for :trigger, :pipe and :out to create the components.
    
    * `stores` Object with `trigger, pipe e out` + reducers.

* **$statepipeLog**: `Boolean` (default `false`).
  
    Show logs for everything.

* **$statepipeAutoStart** `Boolean` (default `true`)

    Will start looking into `document.body` as soon as it loads on the page.
 
* **$statepipeStores** `Object`.
  
    An object with the properties: `trigger, pipe and out`. These props must map the reducers that will want to use. This store is the **default location** used by statepipe when **$statepipeAutoStart=true**.

###  👉 All reducers:

* $statepipeStores.[trigger]({{<ref "/docs/trigger" >}})
* $statepipeStores.[pipes]({{<ref "/docs/pipe" >}})
* $statepipeStores.[out]({{<ref "/docs/out" >}})
