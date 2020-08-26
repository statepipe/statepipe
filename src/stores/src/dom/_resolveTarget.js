export default function resolveTarget(value, event, node, wrapper) {
  if (value === "event") return event;
  if (value === "self") return node;
  if (value === "wrapper") return wrapper;
  if (value === "doc")  return document;
  if (value === "docElm")  return document.documentElement;
  if (value === "body")  return document.body;
  if (value === "win")  return window;
  if (value === "history")  return history;
  return null;
}
