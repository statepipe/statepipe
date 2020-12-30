import utils from "./utils";
import handleRemovedNodes from "./handleRemovedNodes";
import handleAction from './handleAction';
import handleState from './handleState';
import statepipe from "./index";

// test if a node belong only to ctx or if its from 
// a different context
const myContext = ctx => node => Array
    .from(ctx.wrapper.querySelectorAll(utils.QUERY_STATEPIPE) || [])
    .reduce((mine, newwrapper) => {
        if (mine === true
        && newwrapper.contains(node)){
            //muttation from inner context
            mine = false;
        }
        return mine;
    }, true) ? node : null;

const handleMutation = ctx => {
    if (!utils.validateState(ctx) 
    || (!!ctx && ctx.components && ctx.components.length === 0)
    || !utils.validateState((ctx||{}).wrapper)){
        return null;
    }

    return mutations => Array
        .from(mutations = mutations||[])
        .forEach(mutation => {

            if (mutation.removedNodes.length) {
                const list = Array
                    .from(mutation.removedNodes)
                    .filter(utils.validateNode);
                handleRemovedNodes(ctx, list);
            }

            // create new instances and
            // new children 
            if (mutation.addedNodes.length) {
                const list = Array
                    .from(mutation.addedNodes)
                    .filter(utils.validateNode);

                const newSchemas = list
                    .filter(node => {
                        if (utils.validateProp(
                            node.getAttribute(utils.STATEPIPE_ATTR)
                        )){
                            //new context here
                            statepipe(node, ctx.stores);
                            return null;
                        }
                        return node;
                    })
                    .filter(myContext(ctx))
                    .map(ctx.addComponents)
                    .reduce(utils.flatten,[])
                    .filter(item => !!item);

                if (newSchemas.length) {
                    ctx.components = 
                        ctx.components.concat(newSchemas);
                }
            }

            const isAction = !!(mutation.attributeName||"").match(utils.ACTION_ATTR);
            const isState = !!(mutation.attributeName||"").match(utils.STATE_ATTR);

            if ( (!isAction && !isState
                || !utils.validateProp(mutation.target.statepipe))) {
                return;
            }

            const action = isAction ? mutation.target.getAttribute(utils.ACTION_ATTR) : null;
            const payload = isAction ? utils.parseJSON(mutation.target, utils.PAYLOAD_ATTR) : null;

            if (isAction 
                && utils.validateState(payload)
                && utils.validateProp(action)
                ){
                ctx.components
                    .filter(schema => schema.type === utils.PIPE_STORE)
                    .forEach(handleAction(action, payload, mutation.target));
                return;
            }
            if (isState) {
                ctx.components
                    .filter(schema => schema.type === utils.OUT_STORE
                        && schema.node === mutation.target
                        && utils.validateNode(schema.node)
                    ).forEach(handleState);
            }

        });
    };

export default handleMutation;