---
title: filters and contexts
description: Exemplos de como filtrar ações para produzir pipes mais eficientes
---

{{% hlink h2 "Filters and Contexts" %}}

É comum se deparar com problemas onde algum outro componente dispara uma ação que você acreditava que só um determinado componente deveria disparar.

O reducer [from]({{< relref "/docs/pipe#from" >}}) consegue filtrar ações e suas origens de várias formas.

<small>

**Reducers**

{{% reducer-docs "trigger" "nodePick" %}}
{{% reducer-docs "pipe" "from,inc" %}}
{{% reducer-docs "out" "text" %}}

</small>

{{< partial "examples/filter-and-context"/ >}}
