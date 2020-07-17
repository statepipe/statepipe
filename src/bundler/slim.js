import statepipe from "../statepipe";

global.$statepipeLog = new Boolean(global.$statepipeLog || false) == true;
global.$statepipeAutoStart = new Boolean(global.$statepipeAutoStart || true) == true;
global.$statepipeStores = global.$statepipeStores || {};

if (global.$statepipeAutoStart) {
  statepipe(document.body,global.$statepipeStores);
}
  
module.exports = global.$statepipe = statepipe;
