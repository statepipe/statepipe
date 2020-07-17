---
title: :statepipe
description: setup e inicialização da statepipe
weight: 5
tags: 
    - statepipe
    - docs
---

## :statepipe api

O objetivo principal da statepipe é que seja possível fazer tudo somente nos atributos html. 

Uma vez que ela é carregada na página algumas variáveis globais são criadas:

* **$statepipe(wrapper, stores)** `Function`.

    * `wrapper` é qualquer elemento html. A statepipe irá percorrer todos elementos buscando pelo atributo `:statepipe="name"` para definir um **context**. Com o context definido ela irá procurar por :trigger, :pipe e :out para criar os componentes
    
    * `stores` Object com `trigger, pipe e out` + reducers.

> Para sobrepor qualquer regra abaixo, defina os valores **antes** de carregar o script da statepipe.

* **$statepipeLog**: `Boolean` (default `false`).
  
    Define se a statepipe irá gerar logs no console.

* **$statepipeAutoStart** `Boolean` (default `true`)

    Define se a statepipe irá serializar `document.body` assim que for carregada na página.
 
* **$statepipeStores** `Object`.
  
    Deve possuir as properties `trigger, pipe e out` e dentro delas os reducers que serão usados. Essa é **store default** usada pela statepipe quando inciada via **$statepipeAutoStart**.


 👉 Lista de reducers disponíveis:

* $statepipeStores.[trigger]({{<ref "/docs/trigger" >}})
* $statepipeStores.[pipes]({{<ref "/docs/pipe" >}})
* $statepipeStores.[out]({{<ref "/docs/out" >}})
