---
title: workflow
description: All the mutation flow from a trigger trough an output
weight: 2
tags:
  - workflow
  - action
  - payload
  - output
---

{{% hlink h2 Workflow %}}

The **statepipe** listens and reacts to mutation events that happen into specific wrappers (defined by <mark>:statepipe</mark> attribute - which is your **component context**).

The attributes are <mark>:state</mark> and <mark>:action</mark>

{{% hlink h3 "1- Action" %}}
			
**Action** is the beginning of the workflow.

They will only be dispatched by [triggers]({{< ref "/core/triggers" >}}).

**Every action carries a *payload* after them!**

It is defined by the attribute `:trigger=""`.

{{< highlight html "style=pygments">}}
<button :state='{"value":0}' :trigger="hit@click|inc">click</button>
{{< /highlight >}}
			
Payloads are `Objects` produced by [functional reducers]({{< ref "/core/reducers" >}}) defined by the <mark>:trigger</mark>.

Above we have 2 reducers - they are split by `|`

`hit@click|inc` 

The first (<mark>hit@click</mark>) will observe the `click` event to dispatch the **hit** action.

The former ([inc]({{< ref "/docs/trigger#inc" >}})) will increment `state.value` (the state is defined by the attributed`:state={"value":100}`) and send the result of all reducers as the payload to that action.

{{% hlink h3 "2- Capture" %}}

Actions can be captured by [pipes]({{< ref "/core/pipes" >}})

They are defined by the attribute <mark>:pipe</mark>.

{{< highlight html "style=pygments">}}
<span :state='{"value":0}' :pipe="from:hit|add"></span>
{{< /highlight >}}

Pipes can **produce a new state** by the process of passing payload + the current state trough [functional reducers]({{< ref "/core/reducers" >}}) that will update the current state.

When the incoming result of the reducers is different than the actual state the <mark>:state</mark> will updated.

{{% hlink h3 "3- Output" %}}

When the `:state`  changes we can produce a new [output]({{< ref "/core/output" >}}).

The output is defined by the attribute <mark>:out</mark>.

{{< highlight html "style=pygments">}}
<span :out="text"></span>
{{< /highlight >}}

**Every :out need a [pipe]({{< ref "/core/pipes" >}})!**

Sem isso a mudança de state não seria observada por ninguém!

The whole workflow can be osbserved here (use the inspector to see the attributes changing)

<div :statepipe="workflow">
<button :state='{"value":0}' :trigger="hit@click|inc">click</button> - <span
  :state='{"value":0}'
  :pipe="from:hit|add"
  :out="text"></span>
</div>

{{% continue "/core/reducers" %}}
