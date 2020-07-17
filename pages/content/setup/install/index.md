---
title: install
Description: Documentação sobre como carregar a statepipe na sua pagina e iniciar componentes
weight: 5
---

{{% hlink h2 "Instalação" %}}

Crie seus componentes marcando o html.

{{< highlight html "style=github">}}
<body>
<header :statepipe="header">
    <button :trigger="..."></button>
    ...
    <div statepipe="search">
    <input type="text" :pipe="..." :out="..."></input>
    ...
    </div>
</header>
...
...
</body>
{{< /highlight >}}

Carregue o script no final da página:

{{< highlight html "style=github">}}
<body>
    ...
    ...
    ...
    <script src='tbd/statepipe.js' defer></script>
</body>
{{< /highlight >}}

Pronto!

> Veja todas as versões em [dist]({{<ref "/dist">}})

{{% continue "/setup/debug" %}}
