---
title: statepipe
description: It is a javascript tool designed for fast prototyping and zero setup!
layout: single
tags:
 - home
 - statepipe
---

> **statepipe** is a javascript tool designed for fast prototyping and zero setup!

{{% hlink h2 Objectives %}}

* Fast prototyping via html attributes;
					
* Lower Down/Remove *building javascript* (npm stuff) process;

* Components of unique responsibility and with *shallow states*;

* Ease to scale and detach because work with functional reducers;

* Ease to plug and interact with other market's frameworks;

{{% hlink h2 "Mutation Observer" %}}

The core of statepipe is based on {{% ablank "Mutation Observer" "https://caniuse.com/#feat=mutationobserver"%}} feature.

This feature will be used in a way that when excepted attributes get mutations this will be captured to produce **actions, states, and payloads**.

{{% hlink h2 "All inline" %}}

The main idea of statepipe is to prototype **functional components right through the html**.

See:
<div :statepipe="sample-button">
<button
    :state='{"value":0,"tpl":"hits: ${state.value}"}'
    :trigger="hit@click|inc"
    :pipe="from:hit|pick"
    :out="text:tpl"
>hits: 0</button>

{{< highlight html "style=pygments" >}}
<button
    :state='{"value":0,"tpl":"hits: ${state.value}"}'
    :trigger="hit@click|inc"
    :pipe="from:hit|pick"
    :out="text:tpl"
>hits: 0</button>
{{< /highlight >}}
</div>

{{% continue "/core/workflow" %}}
