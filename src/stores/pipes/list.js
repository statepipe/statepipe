import list from "../src/state/list";
import ignorePayload from "./_ignorePayload";

const enforceA = fn => (a,b,c,d) => (ctx) => {
  if (a === "-") {
    c = c || b;
  }
  return ignorePayload(fn)(a,b,c,d)(ctx);
};

export default {
  take: ignorePayload(list.take),
  takeLast: ignorePayload(list.takeLast),
  drop: ignorePayload(list.drop),
  dropLast: ignorePayload(list.dropLast),
  append: ignorePayload(list.append),
  prepend: ignorePayload(list.prepend),
  concat: ignorePayload(list.concat),
  filter: ignorePayload(list.filter),
  filterNot: ignorePayload(list.filterNot),
  reverse: enforceA(list.reverse),
  flatten: enforceA(list.flatten),
  sort: enforceA(list.sort)
};
