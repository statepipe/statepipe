---
title: debug
description: várias formas de debug
weight: 2
---

{{% hlink h2 "Debug" %}}

Existem algumas formas para fazer debug:

{{% hlink h3 "$statepipeLog" %}}

A statepipe pode logar tudo o que acontece, para ativar esse recurso:

{{< highlight html "style=github">}}
<body>
    ...
    ...
    ...
    <script>
        $statepipeLog = true;
    </script>
    <script src='statepipe.js' defer></script>
</body>
{{< /highlight >}}

> Deixe o console do browser aberto nessa página para ver o logs em ação! Use os filtros para facilitar a visualização.

{{% hlink h3 "$statepipeStores" %}}

Uma variável global chamada `$statepipeStores` armazena todas os reducers usados por <mark>:trigger, :pipe e :out</mark>. 

Aplique um **breakpoint** no reducer que você gostaria de inspecionar!

{{% hlink h3 "Mocking" %}}

Por que a statepipe observa mutations é muito simples produzir um <mark>:action</mark> ou uma mudança de <mark>:state</mark> para emular um ações e pipes.

Considere o compomente:

{{< highlight html "style=github">}}
<button
    :state='{"value":0,"tpl":"hits: ${state.value}"}'
    :trigger="hit@click|pick:value"
    :pipe="hit|inc:value"
    :out="text:tpl"
>hits: 0</button>
{{< /highlight >}}

{{% hlink h4 "> Mocking trigger" %}}

Para um trigger ser é preciso que o elemento dispare o evento esperado.

Se o trigger esta ouvindo **click**, selecione o elemento pelo inspector do browser, vá no console e digite

`$0.click()`

> O `$0` nos consoles dos navegarores representam o elemento selecionado!

{{% hlink h4 "> Mocking action" %}}

Emulando uma action é possivel fazer o debug do <mark>:pipe</mark>.

**Primeiro defina o payload!**

Para isso, usando o inspector do browser, selecione o compomente e defina um novo atributo (`addAttribute`) chamado <mark>:payload</mark>:

{{< highlight html "style=github">}}
<button
    :state='{"value":0,"tpl":"hits: ${state.value}"}'
    :trigger="hit@click|pick:value"
    :pipe="hit|inc:value"
    :out="text:tpl"
    :payload='{"value":100}'
>hits: 0</button>
{{< /highlight >}}

**Agora defina uma action**.

Para isso, usando o inspector do browser, selecione o compomente e defina um novo atributo (`addAttribute`) chamado <mark>:action</mark> com o valor que seu <mark>:pipe</mark> espera.

{{< highlight html "style=github">}}
<button
    :state='{"value":0,"tpl":"hits: ${state.value}"}'
    :trigger="hit@click|pick:value"
    :pipe="hit|inc:value"
    :out="text:tpl"
    :payload='{"value":100}'
    :action='hit'
>hits: 0</button>
{{< /highlight >}}

Essa ação irá gerar a mutation que a statepipe precisa para passar pelos reducers do <mark>:pipe</mark>

{{% hlink h4 "> Mocking state change" %}}

Emulando uma mudança de <mark>:state</mark> é possivel fazer o debug do <mark>:out</mark>.

Para isso, usando o inspector do browser, selecione o compomente atualize (`addAttribute`) a *property* <mark>:state</mark> com o **novo valor** (Precisa ser uma string de JSON valida).

{{% continue "/setup/custom-reducers" %}}
