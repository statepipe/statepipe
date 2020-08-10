import attr from "./attr";
import prop from "./prop";
import fn from "./fn";

export default {
  fnRun: fn("run"),
  fnGet: fn("get"),
  propPick: prop("pick"),
  propSet: prop("set"),
  attrSet: attr("set"),
  attrRm: attr("rm"),
  attrTogg: attr("togg"),
  attrPick: attr("pick"),
};
