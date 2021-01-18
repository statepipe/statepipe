export const render = html => {
  let id = `test-${Date.now()}-${Math.random().toString().match(/\d+/)[0]}`;
  const container = document.createElement('div');
  container.setAttribute('id', id);
  container.innerHTML = html;
  //document.body.innerHTML = '';
  document.body.appendChild(container);
  return container;
};

import {STATEPIPE_ATTR} from './const';

const hashName = () => {
  return `statepipe-${Date.now()}-${Math.random()
    .toString()
    .replace(/\./, '')}`;
};

/**
 * Create new statepipe wrapper and add
 * *html* as children
 * @param {*} html String or HTMLElement
 * @return {HTMLElement}
 */
export const statepipeWrapper = html => {
  let id = `test-${Date.now()}-${Math.random().toString().match(/\d+/)[0]}`;
  const container = document.createElement('div');
  container.setAttribute(STATEPIPE_ATTR, hashName());
  container.setAttribute("id", id);
  if (typeof html === "string")  {
    container.innerHTML = html;
  } else {
    container.appendChild(html);
  }
  //document.body.innerHTML = '';
  document.body.appendChild(container);
  return container;
};;
