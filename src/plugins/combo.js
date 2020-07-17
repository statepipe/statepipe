(nodes => {

  const getSchema = type => n => {
    const s = n.split("=");
    if (s.length!==2 || !s[0].length || !s[1].length) {
      if (global.$statepipeLog) console.warn(`:statepipe :combo:${type} malformed schema:"${n}"`);
      return null;
    }
    return {type: type, name: s[0],fn: s[1]};
  };

  const listReducers = (schema, reducers) => {
    return schema.fn
      .split("|")
      .map(fun => {
        const ff = fun.split(":");
        const fn = ff.shift();
        if (typeof reducers[fn] !== "function"){
          if (global.$statepipeLog) console.warn(`:statepipe ${schema.type} ${name} -> missing ${fn}!`);
          return null;
        }
        if (global.$statepipeLog) console.log(`:statepipe\t${fn}(${ff})`);
        return reducers[fn].apply(reducers[fn], ff);
      })
      .filter(n => !!n);
  };

  const combineReducers = (node, reducers) => schema => {
    if (!node || !schema) return null;
    reducers = reducers || {};
    reducers[schema.name] = () => {
      if (global.$statepipeLog) console.info(`:statepipe :combo:${schema.type} ${schema.name} created`);
      const queue = listReducers(schema, $statepipeStores[schema.type]);
      if (!queue.length) {
        if (global.$statepipeLog) console.warn(`:statepipe :combo:${schema.type}: #${schema.name} has no valid reducers`);
        return null;
      }
      return (a,b,c) => {
        // a = state
        // b = event/node (triggers/output)
        if (schema.type.match(/trigger|out/)) {
          return queue.reduce((acc, exec) => {
            return acc = exec(acc, b, c);
          }, a);
        } else if (schema.type === "pipe") {
          //a = payload
          //b = state
          return queue.reduce((acc, exec) => {
            return acc = exec(a, acc);
          }, b);
        }
        return a;
      };
    };
    return schema;
  };

  const validate = attr => {
    return (attr || "")
      .trim()
      .replace(/\r\n|\n|\r|\s/gmi,"")
      .split(",")
      .filter(v => !!v && v.length);
  };

  const setCombo = node => {
    return ["trigger", "out", "pipe"].map(type => {
      const attr = node.getAttribute(`:combo:${type}`);
      const slugs = validate(attr);
      if (slugs.length) {
        if (!$statepipeStores[type]){
          $statepipeStores[type] = {};
        }
        slugs
          .map(getSchema(type))
          .filter(blob => !!blob)
          .map(combineReducers(node, $statepipeStores[type]));
      }
    });
  };

  return Array.from(nodes).map(setCombo);

})(document.body.querySelectorAll("[\\:combo\\:out],[\\:combo\\:trigger],[\\:combo\\:pipe]"));
