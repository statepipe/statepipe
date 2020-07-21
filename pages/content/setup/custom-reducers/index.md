---
title: custom reducers
Description: How to apply custom reducers.
---

{{% hlink h2 "Custom Reducers" %}}

The easy way is to load/inject your reducers before loading statepipe on your page.

Make sure to merge existent reducers on the page before setting new ones!

{{< highlight html "style=pygments">}}
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
