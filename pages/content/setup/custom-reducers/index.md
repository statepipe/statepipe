---
title: custom reducers
Description: Documentação sobre como criar custom reducers para seu projeto.
---

{{% hlink h2 "Custom Reducers" %}}

A forma mais simples de criar reducers é injeta-lo (ou o script que os contém) na página **antes** do script da statepipe:

{{< highlight html "style=github">}}
<body>
    ...
    ...
    ...
    <script>
        let stores = window.$statepipeStores || {}
        stores.out = Object.assign(stores.out || {} , {
            "redirect" : () => (state, node) => {
                location.href = state.value;
            }
        })
        stores.trigger = Object.assign(stores.trigger || {} , {
            "now" : () => (state, event, node) => {
                return Object.assign(state,{now:Date.now()});
            }
        })
        stores.pipe = Object.assign(stores.pipe || {} , {
            "rnd" : () => (payload, state, action, node, origin) => {
                return Object.assign(state,{rnd:Math.random()});
            }
        })
        window.$statepipeStores = stores;
    </script>
    <script src='statepipe.js' defer></script>
</body>
{{< /highlight >}}

Agora a statepipe ja pode contar com um 3 novos reducer.
Assim que ele carregar irá fazer o merge da store que ja vem com ela e os definidos manualmente.
