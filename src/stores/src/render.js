import {is , not, lensPath, view} from "ramda";
import utils from "~/src/statepipe/utils";

const validateProp = prop => typeof prop === "string" && prop.length > 0;
const validadeObject = object => is(Object, object) && not(is(Array, object));

const validateStateNode = (state, node) => utils.validateState(state)
  && utils.validateState(node);

const appendPrepend = (fn, prop, state, node) => {
  if (not(validateStateNode(state,node))
  || not(utils.validateProp(prop))
  || not(utils.validateProp(fn))
  ) {
    return state;
  }

  try {
    const tpl = getTemplate(prop, state, node);
    if (tpl && tpl.length){
      let mock = document.createElement('div');
      mock.innerHTML = tpl;
      if (fn === "appendChild"){
        node.appendChild(mock.firstChild); 
      } else if (fn === "prepend") {
        node.prepend(mock.firstChild); 
      }
    }
  } catch (err) {
    utils.log(`:statepipe ${node.statepipe}/ ${node.nodeName} cant evaluate: "${prop}" with state`, state);
    utils.log(err);
  }
  return state;
};

const getTemplate = (name, state, node) => {
  name = name || "";

  if (not(utils.validateProp(name))
  || not(validateStateNode(state,node))
  ) {
    return state;
  }

  try {
    if (document != undefined && document.querySelector){
      const n = document.querySelector(name);
      if (n && n.innerHTML) {
        return unescape(eval('`'+n.innerHTML.trim()+'`')).trim();
      }
    }
  } catch (err) {
    utils.log(`:statepipe ${node.statepipe}/ ${node.nodeName} querySelector(${name}) evaluating innerHTML with`, state);
    utils.log(err);
    return null;
  }
  return null;
};

const getRenderedText = (prop, state) => {
  prop = prop || "value";
  const value = view(lensPath(prop.split(".")), state);
  if (value === undefined) return null;
  return unescape(eval('`'+value.toString()+'`')).trim();
};

const addProp = (propName, propLens) => (state, node) => {
  propLens = propLens || "value";
  if (not(validateStateNode(state,node))
  || not(utils.validateProp(propName))
  || not(utils.validateProp(propLens))
  ) {
    return state;
  }

  const value = view(lensPath(propLens.split(".")), state);
  if (value !== undefined) {
    node[propName] = value;
  }
  return state;
};

const fnAttr = fn => (attrName, attrValue) => (state, node) => {

  if (not(validateStateNode(state,node))
  || not(utils.validateProp(attrName))){
    return state;
  }
  attrValue = attrValue || "value";
  
  let newValue = view(lensPath(attrValue.split(".")), state);

  if (newValue !== undefined){
    try {
      newValue = eval('`'+newValue+'`');
    } catch (err) {
      newValue = undefined;
      utils.warn(`:statepipe ${node.statepipe} / ${node.nodeName} error evaluating ${attrValue} with state`, state);
      utils.log(err);
    }
  }

  if (undefined === newValue) {
    return state;
  }

  if (fn == "set" && node.getAttribute(attrName) !== newValue) {
    node.setAttribute(attrName, newValue);
  }
  else if (fn == "remove" && node.getAttribute(attrName)) {
    node.removeAttribute(attrName);
  }
  else if (fn === "toggle") {
    if (node.getAttribute(attrName) === newValue){
      node.removeAttribute(attrName);
    } else {
      node.setAttribute(attrName, newValue);
    }
  }
  return state;
};


const fnClass = fn => prop => (state, node) => {
  prop = prop || "value";
  
  if (not(validateStateNode(state,node))){
    return state;
  }
  
  let newValue = view(lensPath(prop.split(".")), state);
  try {
    newValue = eval('`'+newValue+'`');
  } catch (err) {
    newValue = undefined;
    utils.warn(`:statepipe ${node.statepipe} / ${node.nodeName} error evaluating ${fn} with state`, state);
    utils.log(err);
  }

  if (newValue === undefined){
    return state;
  }
  
  if (fn === "add" 
  && not(node.classList.contains(newValue))) {
    node.classList.add(newValue);
  }
  else if (fn === "remove"
  && node.classList.contains(newValue)) {
    node.classList.remove(newValue);
  }
  else if (fn === "toggle") {
    node.classList.toggle(newValue);
  }
  return state;
};

const textContent = prop => (state, node) => {
  prop = prop || "value";
  if (not(validadeObject(state))
  || not(validadeObject(node))
  || not(validateProp(prop))
  ) {
    return state;
  }

  try {
    const text = getRenderedText(prop, state);
    if (text) node.textContent = text;
  } catch(err){
    utils.log(`:statepipe ${node.statepipe}/ ${node.nodeName} error evaluating ${prop} with state`, state);
    utils.log(err);
  }
  return state;
};

const innerHTML = name => (state, node) => {
  if ( not(validateProp(name))
  || not(validadeObject(state))
  || not(validadeObject(node))
  ) {
    return state;
  }
  try {
    const tpl = getTemplate(name, state, node);
    if (tpl && tpl.length) {
      node.innerHTML = tpl;
    }
  } catch (err) {
    utils.log(`:statepipe ${node.statepipe}/ ${node.nodeName} innerHTML errror`, state);
    utils.log(err);
  } 
  return state;
};

export default {
  attrSet: fnAttr("set"),
  attrRm: fnAttr("remove"),
  attrToggle: fnAttr("toggle"),
  classAdd: fnClass("add"),
  classRm: fnClass("remove"),
  classToggle: fnClass("toggle"),
  prop: addProp,
  text: textContent,
  template: innerHTML,
  appendChild: (prop) => (state, node) => appendPrepend("appendChild", prop, state, node),
  prependChild: (prop) =>(state, node) => appendPrepend("prepend", prop, state, node)
};
