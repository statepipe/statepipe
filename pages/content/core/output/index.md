---
title: "output"
description: O objetivo de um :out é produzir mudanças no componente (atributo, css, textContent, children etc)
weigth: 5
tags:
    - out
    - output
---

{{% hlink h2 "Output" %}}

* **Atributo**: <mark>:out</mark>
* **Objetivo**: produzir mudanças no componente (atributo, css, textContent, children etc)
* * **Store** : `$statepipeStores.out`
* **Reducer Context**: `(state, node)`
* **Reducers Docs**: [out]({{< relref "/docs/out" >}})

Possuem uma classe unica de reducers, [render]({{< relref "/docs/out#render" >}}). Eles podem modificar um elemento de várias formas: textContent, innerHTML, setAttrivute, class etc.

Por padrão, sempre que o output gerar novos nós ([template]({{< relref "/docs/out#template" >}}), [appendChild]({{< relref "/docs/out#appendChild" >}}) etc) esses elementos serão lidos pelo context (wrapper :statepipe ao qual o compomente pertence) e serializados como novos compomentes, caso possuam os atributos :trigger, :pipe ou :out.

> Veja o comportamento de templates gerando novos compomentes no exemplo da [todo-list]({{< relref "/examples/todo-list" >}}).

{{% continue "/docs/out" %}}
