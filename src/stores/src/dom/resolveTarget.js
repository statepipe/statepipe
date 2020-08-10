export default function resolveTarget(value, event, node, ctx) {
  if (value === "event") return event;
  if (value === "self") return node;
  if (value === "ctx") return ctx;
  if (value === "doc")  return document;
  if (value === "docElm")  return document.documentElement;
  if (value === "body")  return document.body;
  if (value === "win")  return window;
  if (value === "history")  return history;
  return null;
}
