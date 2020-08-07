---
title: Filter and Context
description: Using the reducer *from* to understand better how context works and how to manage to filter them properly.
---

{{% hlink h2 "Filters and Contexts" %}}

If you find yourself trying to understand the origin of an action, you are looking for the reducer [from]({{< relref "/docs/pipe#from" >}}).

Check how to filter whatever you want at pipe level.

<small>

**Reducers**

{{% reducer-docs "trigger" "propPick" %}}
{{% reducer-docs "pipe" "from,inc" %}}
{{% reducer-docs "out" "text" %}}

</small>

{{< partial "examples/filter-and-context"/ >}}
