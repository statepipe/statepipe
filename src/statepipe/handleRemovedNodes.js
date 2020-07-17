import utils from "./utils";

export default (ctx,list) => (list||[]).forEach(rmNode => {
    //remove components
    ctx = ctx || {};
    ctx.components = (ctx.components || [])
    .filter(schema => {
        if (schema && schema.node === rmNode){
            utils.log(`:statepipe ${schema.wrapper}: ${schema.node.nodeName}:${schema.type} removed from page.`);
            return null;
        }
        return schema;
    });
    
    if (ctx.wrapper === rmNode) {
        ctx.components = [];
        if (ctx.observer
        && typeof ctx.observer.disconnect === "function") {
            ctx.observer.disconnect();
        }
        delete ctx.stores;
        delete ctx.add;
        delete ctx.components;
        delete ctx.observer;
        delete ctx.wrapper;
        delete ctx.addCompoents;
        ctx.ejected = true;
        utils.log(`:statepipe ${ctx.name}: ejected!`);
    }
    return ctx;
});
