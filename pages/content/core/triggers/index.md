---
title: "triggers"
description: Objetivo é de um :trigger é produzir :action + :payload quando reagir ao evento esperado daquele elemento.
weigth: 3
tags:
   - trigger
   - action
   - payload
---

{{% hlink h2 "Triggers" %}}

* **Atributo**: <mark>:trigger</mark>
* **Objetivo**: produzir action + payload
* **Store** : `$statepipeStores.trigger`
* **Reducer Context**: `(state, event, node)`
* **Reducers Docs**: [trigger]({{< relref "/docs/trigger" >}})

É o único tipo de etapa que precisa de 2 reducers, pelo menos.

Todo trigger precisa ouvir algum evento, essa definição é obrigatória e deve ser sempre a primeira de cada block.

O reducer obrigatório deve seguir a syntaxe:

`action@eventBind`

* **action**: nome da ação que deve ser criada quando *eventBind* for disparado.

* **eventBind**: nome do evento que deve ser ouvido naquele node. `node.addEvetListener(eventBind, handleTrigger);`

Exemplos: 

* trigger="<mark>hit@click</mark>" 👎 inválido

* trigger="<mark>hit@click|pickAll</mark>" 👍 válido

* trigger="<mark>hit@click|pickAll,add@click|pick:id</mark>" 👍 válido (2 action mesmo evento)

* trigger="<mark>hit@click|pickAll,add@change|pick:id</mark>" 👍 válido (2 actions em eventos diferentes)

Em alguns casos não é possivel ter acesso  - via html - a alguns elementos.

Para esses casos existe uma sintaxe especial:

* **document**: <mark style="background-color:lightgreen">trigger="hit@document.load</mark>
* **documentElement**:  <mark style="background-color:lightgreen">trigger="hit@documentElement.foo</mark>
* **body**:  <mark style="background-color:lightgreen">trigger="hit@body.foo</mark>
* **window**:  <mark style="background-color:lightgreen">trigger="hit@window.resize</mark>

Nos exemplos acima, não importa em qual compomente statepipe você definir o trigger, ele sempre será feito em outro target - isso pode mudar a forma como vocês irá capturar as actions no [pipe]({{< relref "/docs/pipe#from" >}})!

Possuem uma classe única de reducer com acesso ao [event]({{< relref "/docs/trigger#event" >}}) que executar ações sob o *event*.

{{% continue "/docs/trigger" %}}
