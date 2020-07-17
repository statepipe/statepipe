import utils from "~/src/statepipe/utils";
import node from "./mock-node";

const simple = (name) => {
    const wrapper = node({});
    name = name || (`slimple-${Date.now()}-${Math.random()}`);
    const n = node()
    n.setAttribute(utils.STATEPIPE_ATTR, name)
    n.setAttribute(utils.OUT_ATTR, "text:value")
    n.setAttribute(utils.PIPE_ATTR, "set:value:result")
    n.setAttribute(utils.TRIGGER_ATTR, "ping@click|pick")
    n.setAttribute(utils.STATE_ATTR, JSON.stringify({value:"sample"}))
    wrapper.setQueryResult([n]);
    return {name, wrapper};
}

const slim = (name) => {
    const wrapper = node({});
    name = name || (`slim-${Date.now()}-${Math.random()}`);
    wrapper.setQueryResult([node({
        [utils.STATEPIPE_ATTR] : name
    })]);
    return {name, wrapper};
}


const withChildren = (children, name) => {
    const wrapper = node({});
    name = name || `withChildren-${Date.now()}-${Math.random()}`
    const main = node({});
    main.setAttribute(utils.STATEPIPE_ATTR, name)
    main.setQueryResult(children)
    wrapper.setQueryResult([main]);
    return {name, wrapper};
}

const element = (type, value) => node({
    [type] : value,
    [utils.STATE_ATTR]: JSON.stringify({value:true})
});

export default {
    element,
    withChildren,
    simple,
    slim
};