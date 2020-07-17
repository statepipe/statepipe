---
title: reducers
description: Os reducers são uma parte fundamental de todo workflow da statepipe. Operam de maneira funcioanl state e/ou payload gerando mutations que propagam para outros componentes.
layout: single
weight: 1
tags:
    - reducers
    - trigger
    - out
    - pipe
---

{{% hlink h2 Reducers %}}

Do momento em que uma ação é gerada por um trigger até que essa mutação vire um output, state/payload precisam passar por reducers para produzirem qualquer tipo de mutação, sem as mutações dos atributos nada acontecerá.

> A grande maioria dos reducers disponívels usam princípios da programação funcional, quase todos usam {{% ablank "ramda" "https://ramdajs.com/" %}}

Os reducers podem ser extendidos facilmente, digite `$statepipeStores` no console do navegador.

Cada etapa do [workflow]({{< ref "/core/workflow" >}}) acessa uma lista interna de reducers específica.

* **:trigger** `$statepipeStores.trigger`
* **:pipe** `$statepipeStores.out`
* **:out** `$statepipeStores.pipe`

A syntaxe para contruir qualquer etapa do workflow é a mesma:

* :pipe="<mark>block1</mark>,<mark style="background-color:cyan">block2</mark>"

* :trigger="<mark>block1</mark>,<mark style="background-color:cyan">block2</mark>"

* :out="<mark>block1</mark>,<mark style="background-color:cyan">block2</mark>"

Os *blocks* são grupos de instrução para aquele compomente. Um trigger, por exemplo, poderia disparar uma ação *add-to-cart* e *track-event* sempre que o usuário clicar em um botão.

Dentro de cada *block* podemos cadastrar quantos reducers forem necessários (o exemplo abaixo é valido para qualquer estrutura além de :pipe).

Esses reducers devem **sempre estar disponíveis** em `$statepipeStores`!

Para separar encadear reducers devemos usar o caracter `|`. 
Para definir os parametros enviados ao reducer devemos usar o `:`.

* :pipe="<mark>from:add-to-cart|append</mark>,<mark style="background-color:cyan">from:track-event|ga</mark>"

O primeiro *block* <mark>from:add-to-cart|append</mark> é formado por:

1. `from:add-to-cart` - usa o reducer [from]({{< ref "/docs/pipe#from" >}}) passando add-to-cart como parametro.
2. `append` - apenas irá usar reducer [append]({{< ref "/docs/pipe#append" >}}) sem enviar nenhum parametro extra.

**Enquanto um reducer produzir um state/payload válidos** (diferente de `null`) ele será passado de um para o outro até terminar um *block*, e depois o próximo *block* será executado.

O que muda entre os reducers de [trigger]({{< ref "/docs/trigger" >}}), [pipe]({{< ref "/docs/pipe" >}}) e [out]({{< ref "/docs/out" >}}) é o contexto em que mutação acontece, isso permite acesso a diferentes parametros.

Todo reducer deve ser contruído em 2 etapas:

1. [Definição de parametros](#definição de parametros)
2. [Execução](#execução)

---


{{% hlink h2 "Definição de parametros" %}}

É nessa etapa onde iremos dizer para ao reducer quais valores devem ser acessados no state/payload para gerar a mudança. 

Essa fase sempre deve retornar uma função - que será chamada na fase de [Execução](#execução) com os parametros daquele contexto.

`(...args) => (...contextAgs) => {}`

Considere os reducers <mark>dec:stock</mark>|<mark style="background-color:cyan">pick:sku:name:price</mark>

Significa que o reducer:

* **dec** irá receber a string `stock` como argumento. Ex: `const runTrigger = dec("stock");`
  
* **pick** irá receber a string `sku,name,price` como argumento. Ex: `const runTrigger = pick("sku,name,price");`

> A maioria dos reducers considera o primeiro argumento como `value`. Dessa forma os compomentes ficam mais simples. Ex: `add:value` (state.value) é o mesmo que apenas `add` 

---

{{% hlink h2 "Execução" %}}

Cada etapa do workflow tem um objetivo e os reducers dela terão acesso a informações específicas à etapa:

{{% hlink h3 "Context :trigger" %}}

Um *:trigger* responde à eventos e precisa ter acesso a eles, ao próprio nó e ao state (definido no atributo <mark>:state="{}"</mark>).

`(state, event, node) => state`

Considere os reducers <mark>eventFn:preventDefault</mark>|<mark style="background-color:cyan">dec:total</mark>|<mark style="background-color:lightgreen">nodePick</mark>

Cada reducer poderá consumir uma parte diferente dos argumentos disponíveis naquele *context*.

* **eventFn:preventDefault** 

  ```
  const fn = eventFn("preventDefault");
  fn(state,event,node) // event.preventDefault();
  return state;
  ```
* **dec:total** 

  ```
  const fn = dec("total");
  fn(state,event,node) // state.total = dec(state.total);
  return state;
  ```
* **nodePick** 

  ```
  const fn = nodePick();
  fn(state,event,node) // state.value = node.value;
  return state;
  ```

{{% continue "/core/triggers" %}}

{{% hlink h3 "Context :pipe" %}}

Um *:pipe* pode **capturar ações de qualquer componente**. Também terá acesso á *action* e ao *payload* para produzir um novo state.

`(payload, state, action, node, origin) => state`

Considere os reducers <mark>from:add</mark>|<mark style="background-color:cyan">add:price:total</mark>

Cada reducer poderá consumir uma parte diferente dos argumentos disponíveis naquele *context*.

* **from:add** 

  ```
  const fn = from("add");
  fn(payload, state, action, node, origin) // if (action != "add" ) return null;
  return state;
  ```
* **add:price:total** 

  ```
  const fn = add("price","total");
  fn(state,event,node) // state.total = add(payload.price, state.total);
  return state;
  ```

{{% continue "/core/pipes" %}}

{{% hlink h3 "Context :out" %}}

Um *:out* é chamado quando o compomente **recebe um novo state** através do atributo :state. 

`(state, node) => state`

Considere os reducers <mark>nodeFn:blur</mark>|<mark style="background-color:cyan">concat:id:size:sku|text:sku</mark>

* **nodeFn:blur** 

  ```
  const fn = nodeFn("blur");
  fn(state,node) // node.blur();
  return state;
  ```
* **concat:id:size:sku|text:sku** 

  ```
  let fn = concat("id","size","sku");
  fn(state,node) // state.sku = concat(state.id, state.size);
  fn = text("sku");
  fn(state,node) // node.textContent = state.sku;
  return state;
  ```
  
{{% continue "/core/output" %}}
