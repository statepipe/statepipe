---
title: workflow
description: Workflow de mutations de um trigger até um output.
weight: 2
tags:
  - workflow
  - action
  - payload
  - output
---

{{% hlink h2 Workflow %}}

A statepipe observa e reaje à **mutations dos atributos** <mark>:action</mark> e <mark>:state</mark>.

{{% hlink h3 "1- Action" %}}
			
Uma *action* é o início do workflow de um componente statepipe.

Somente [triggers]({{< ref "/core/triggers" >}}) podem gerar actions!

**Toda action carrega com ela um payloads**!

Um <mark>:trigger</mark> é definido pelo atributo `:trigger=""` direto no elemento.

{{< highlight html "style=github">}}
<button :state='{"value":0}' :trigger="hit@click|inc">click</button>
{{< /highlight >}}
			
Payloads são `Objects` gerados pelos [reducers]({{< ref "/core/reducers" >}}) definidos pelo trigger.

Em :trigger=`hit@click|inc` temos 2 reducers:

O primeiro <mark>hit@click</mark> irá apenas observar o evento de click do elemento para disparar a action **hit** quando clicado.

O segundo reducer [inc]({{< ref "/docs/trigger#inc" >}}) irá incrementar o valor `state.value` (definido pelo atributo `:state`) e envia-lo como payload.

{{% hlink h3 "2- Capture" %}}

Actions podem ser capturadas por [pipes]({{< ref "/core/pipes" >}})

Um <mark>:pipe</mark> é definido pelo atributo `:pipe=""` direto no elemento.

Os pipes podem produzir um novo state **processando o payloads com o próprio state** através dos reducers definidos para ele.

{{< highlight html "style=github">}}
<span :state='{"value":0}' :pipe="from:hit|add"></span>
{{< /highlight >}}

Quando o resultado dos reducers de um pipe produzem um novo state, ele será gravado no atributo `:state`.

{{% hlink h3 "3- Output" %}}

Sempre que uma mudança no `:state` de um compomente é capturada podemos produzir um [output]({{< ref "/core/output" >}}) no elmento.

Um <mark>:out</mark> é definido pelo atributo `:out="text"` direto no elemento.

{{< highlight html "style=github">}}
<span
  :state='{"value":0}'
  :pipe="from:hit|add"
  :out="text"></span>
{{< /highlight >}}

Todo :out **precisa ter um [pipe]({{< ref "/core/pipes" >}})**! 

Sem isso a mudança de state não seria observada por ninguém!

Exemplo completo:

<div :statepipe="workflow">
<button :state='{"value":0}' :trigger="hit@click|inc">click</button> - <span
  :state='{"value":0}'
  :pipe="from:hit|add"
  :out="text"></span>
</div>

{{% continue "/core/reducers" %}}
