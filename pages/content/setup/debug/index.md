---
title: debug
description: how to debug
weight: 2
---

{{% hlink h2 "Debug" %}}

There many ways to debug the flow.

{{% hlink h3 "Logging with $statepipeLog" %}}

Turn it on by `$statepipeLog=true` before your statepipe.js script.


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

> It logs a lot! Use the console's filter!

{{% hlink h3 "Breakpoints $statepipeStores" %}}

Set a breakpoint at the reducer you want to debug. `$statepipeStores` is the hub of all reducers!

{{% hlink h3 "Mocking" %}}

Change an attribute by yourself! Because statepipe listen to attribute mutations do the changes you need and check the behavior.

Consider the following:

{{< highlight html "style=github">}}
<button
    :state='{"value":0,"tpl":"hits: ${state.value}"}'
    :trigger="hit@click|pick:value"
    :pipe="hit|inc:value"
    :out="text:tpl"
>hits: 0</button>
{{< /highlight >}}

{{% hlink h4 "Mocking a trigger" %}}

If the trigger is listening for a **click**, select the elemento with the inspector and type on console:

`$0.click()`

{{% hlink h4 "Mocking action" %}}

To test you pipe, you need to mock an action.

**Start by the payload**.

Set a new attribute called <mark>:payload</mark> with a valid string json object. (use `JSON.stringify({your object})`)

{{< highlight html "style=github">}}
<button
    :state='{"value":0,"tpl":"hits: ${state.value}"}'
    :trigger="hit@click|pick:value"
    :pipe="hit|inc:value"
    :out="text:tpl"
    :payload='{"value":100}'
>hits: 0</button>
{{< /highlight >}}

**Now, set the action!**

Set a new attribute called <mark>:action</mark> with the value your <mark>:pipe</mark> expects.

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

{{% hlink h4 "Mocking state change" %}}

Set a new attribute called <mark>:state</mark> with a valid string json object. (use `JSON.stringify({your object})`)

{{% continue "/setup/custom-reducers" %}}
