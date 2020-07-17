---
title: statepipe
description: ferramenta escrita em javascript para componentização rápida com baixo acoplamento e zero setup.
layout: single
tags:
 - home
 - statepipe
---

> **statepipe** é uma ferramenta escrita em javascript para componentização rápida, baixo acoplamento e zero setup!

{{% hlink h2 Objetivos %}}

* Simplificar a componentização apenas modificando atributos direto no html;
					
* Diminuir/eliminar processo de build de javascript;

* Estimular criação de componentes de responsabilidade única e baseados no próprio *state*;

* Ser simples de extender e se conectar com frameworks do mercado;

{{% hlink h2 "Mutation Observer" %}}

O core da ferramenta se basea no {{% ablank "Mutation Observer" "https://caniuse.com/#feat=mutationobserver"%}}.

Essa feature é usada como mecanismo de **transporte de actions, payloads e states**. 

Isso significa que qualquer script da página pode interagir com a **statepipe**!

{{% hlink h2 "Tudo inline" %}}

A ideia principal da statepipe é conseguir **definir compentes simples e funcionais direto no html**.

Exemplo: 
<div :statepipe="sample-button">
<button
    :state='{"value":0,"tpl":"hits: ${state.value}"}'
    :trigger="hit@click|inc"
    :pipe="from:hit|pick"
    :out="text:tpl"
>hits: 0</button>

{{< highlight html "style=github">}}
<button
    :state='{"value":0,"tpl":"hits: ${state.value}"}'
    :trigger="hit@click|inc"
    :pipe="from:hit|pick"
    :out="text:tpl"
>hits: 0</button>
{{< /highlight >}}
</div>

{{% continue "/core/workflow" %}}
