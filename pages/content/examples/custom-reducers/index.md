---
title: custom reducers
description: defining and using custom reducers
---

## Custom Reducers

This example will render a "tab menu" via custom output using Handlebars as template engine.

See that Handlebars will create new elements ready for statepipe!

<small>

**Reducers**

\- out (1): hbl

</small>

{{< partial "examples/custom-reducers"/ >}}

<template id="tpl" type="text/x-handlebars-template">
<div class="tab">
{{#each list}}
    <a href="#" class="{{#if @first}}-selected{{/if}}"
        :state='{"v": {{@index}},"c": "-selected"}'
        :trigger="settab@click|eventFn:preventDefault|pickAll"
        :pipe="from:settab|set:v:s"
        :out="equals:v:s|classAdd:c,notEquals:v:s|classRm:c"
        >{{name}}</a> |
{{/each}}
{{#each list}}
    <div class="{{#unless @first}}-invisible{{/unless}}"
        :state='{"v": {{@index}},"s": 0, "c": "-invisible"}'
        :pipe="from:settab|set:v:s"
        :out="equals:v:s|classRm:c,notEquals:s:v|classAdd:c">
    {{body}}
    <br>
        {{#unless @first}}<a href="#" :state='{"v":{{dec @index}} }' :trigger="settab@click|eventFn:preventDefault|pickAll">prev</a>{{/unless}}
        {{#unless @last}}<a href="#" :state='{"v": {{inc @index}} }' :trigger="settab@click|eventFn:preventDefault|pickAll">next</a>{{/unless}}
    </div>
{{/each}}
</div>
</template>

<script async src="/libs/handlebars.js" defer></script>
