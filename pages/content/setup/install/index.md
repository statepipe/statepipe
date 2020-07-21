---
title: install
Description: How to start using statepipe.
weight: 5
---

{{% hlink h2 "Instalação" %}}

Create your context and define your components on the html:

{{< highlight html "style=pygments">}}
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

Load the [script]({{<ref "/dist" >}}):

{{< highlight html "style=pygments">}}
<body>
    ...
    ...
    ...
    <script src='statepipe.js' defer></script>
</body>
{{< /highlight >}}

Done!

> Check all available versions at [dist]({{<ref "/dist">}}) page.

Go visit the [examples]({{<ref "/examples">}}) to understand better how to start.


{{% continue "/setup/debug" %}}
