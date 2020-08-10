import list from "../src/state/list";
import ignorePayload from "./_ignorePayload";

const persistA = fn => (a,b,c,d) => (payload,state) => {
  if (a === "-"){
    c = c || b;
  }
  return ignorePayload(fn)(a,b,c,d)(payload,state);
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
  reverse: persistA(list.reverse),
  flatten: persistA(list.flatten),
  sort: persistA(list.sort)
};
