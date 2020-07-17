import stores from "../stores";
import utils from "../statepipe/utils";

function getStores() {
  const old = global.$statepipeStores || {};
  const trigger = Object.assign(
    old[utils.TRIGGER_STORE] ||{} , stores[utils.TRIGGER_STORE]);

  const out = Object.assign(
    old[utils.OUT_STORE] ||{}, stores[utils.OUT_STORE]);

  const pipe = Object.assign(
    old[utils.PIPE_STORE] ||{}, stores[utils.PIPE_STORE]);

  return {
    [utils.TRIGGER_STORE]: trigger,
    [utils.OUT_STORE]: out,
    [utils.PIPE_STORE]: pipe,
  };
}
module.exports = global.$statepipeStores = getStores();
      