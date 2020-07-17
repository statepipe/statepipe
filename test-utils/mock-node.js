const List = n => {

  n.className = (n.className || "").trim()

  let arr = n.className
    .split(" ")
    .filter(v => v.length)

  const add = value => {
    arr.push(value)
    n.className = arr.join(" ")
  }

  const remove = value => {
    arr = arr.map(v => v === value ? false : v) .filter(v => !!v)
    n.className = arr.join(" ")
  }

  const toggle = value =>
    contains(value) ? remove(value) : add(value)

  const contains = value => arr.indexOf(value) >= 0

  const toList = _ => arr

  return { contains, add, remove, toggle, toList }
}

const get = (n) => {
  n = n || {}
  let listener
  let list = []
  const node = {
    firstChild: true,
    setQueryResult: items => {list = items||[]},
    querySelectorAll: (name) => list,
    querySelector: (value) => (list ||[])[0],
    createElement: (value) => {
      const n = get();
      n.nodeName = value
      return n
    },
    contains: (n)=> list.indexOf(n) !== -1,
    addEventListener: (name, fn) => listener = fn,
    parentNode: true,
    setAttribute: (name,value) => n[name] = value,
    appendChild: () => {return true},
    prepend: () => {return true},
    removeAttribute: name => n[name] = null,
    getAttribute: (name) => n[name],
    getAttributeNames: () => Object.keys(n),
    toString: () => JSON.stringify(n),
    nodeName: "DIV",
    ...n
  }
  node.classList = List(node)
  return node
}


export default get;
