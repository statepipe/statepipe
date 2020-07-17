---
title: "pipe"
description: O objetivo de um :pipe é produzir um novo state usando o payload da action que ele observa e o próprio state
weigth: 4
tags:
    - pipe
---

{{% hlink h2 "Pipes" %}}

* **Atributo**: <mark>:pipe</mark>
* **Objetivo**: produzir um novo state
* **Store** : `$statepipeStores.pipe`
* **Reducer Context**: `(payload, state, action, node, actionOriginNode)`
* **Reducers Docs**: [pipe]({{< relref "/docs/pipe" >}})

Possuem um tipo unico de reducer [from]({{< relref "/docs/pipe#from" >}}) que permite filtrar origem de uma ação. 

Devem ser usados para capturar ações e processar payloads.

{{% continue "/docs/pipe" %}}
