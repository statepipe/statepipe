import list from "../src/list";
import ignorePayload from "./ignorePayload";

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
  reverse: persistA(list.reverse),
  flatten: persistA(list.flatten),
  concat: ignorePayload(list.concat),
  filter: ignorePayload(list.filter),
  filterNot: ignorePayload(list.filterNot),
  sort: persistA(list.sort)
};
