---
title: switches
description: Lista de exemplos usando *switches de state* para manipular atributos, css e texto.
---

{{% hlink h2 "Switches" %}}

Grande parte das interfaces mais usadas se baseam em mecanismos simples de *switch*, onde apenas alternamos um valor baseado em um *state* que só pode ter 2 valores: active/-, open/-, selected/- etc.

{{% hlink h3 "Tab menu" %}}

<small>

**Reducers**
{{% reducer-docs "trigger" "pickAll,event" %}}
{{% reducer-docs "pipe" "from,set" %}}
{{% reducer-docs "out" "equals,classAdd,notEquals,classRm" %}}

</small>

{{< partial "examples/switches/tabmenu"/ >}}

{{% hlink h3 "Gallery" %}}

<small>

**Reducers**
{{% reducer-docs "trigger" "pick,dec,inc,eventFn,truthy" %}}
{{% reducer-docs "pipe" "set,pickAll,from" %}}
{{% reducer-docs "out" "text,attrSet" %}}

</small>

{{< partial "examples/switches/gallery"/ >}}

{{% hlink h3 "Accordion" %}}

<small>

**Reducers**
{{% reducer-docs "trigger" "pickAll,eventFn,not" %}}
{{% reducer-docs "pipe" "not,from,pickAll,truthy" %}}
{{% reducer-docs "out" "truthy,falsy,equals,text,classAdd,notEquals,classRm" %}}

</small>

{{< partial "examples/switches/accordion"/ >}}

{{% hlink h3 "Tooltips" %}}

<small>

**Reducers**
{{% reducer-docs "trigger" "pickAll,eventFn,not" %}}
{{% reducer-docs "pipe" "set" %}}
{{% reducer-docs "out" "truthy,falsy,classAdd,classRm" %}}

</small>

{{< partial "examples/switches/tooltip"/ >}}

{{% hlink h3 "Modal" %}}

<small>

**Reducers**
{{% reducer-docs "trigger" "pick" %}}
{{% reducer-docs "pipe" "set" %}}
{{% reducer-docs "out" "truthy,falsy,classAdd,classRm" %}}
</small>

{{< partial "examples/switches/modal"/ >}}
