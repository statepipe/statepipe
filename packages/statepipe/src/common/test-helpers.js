export const render = html => {
  let id = `test-${Date.now()}-${Math.random().toString().match(/\d+/)[0]}`;
  const container = document.createElement('div');
  container.setAttribute('id', id);
  container.innerHTML = html;
  document.body.innerHTML = '';
  document.body.appendChild(container);
  return container;
};

import {STATEPIPE_ATTR} from './const';

const hashName = () => {
  return `statepipe-${Date.now()}-${Math.random()
    .toString()
    .replace(/\./, '')}`;
};

export const statepipeWrapper = html => {
  let id = `test-${Date.now()}-${Math.random().toString().match(/\d+/)[0]}`;
  const container = document.createElement('div');
  container.setAttribute(STATEPIPE_ATTR, hashName());
  container.setAttribute('id', id);
  container.innerHTML = html;
  document.body.innerHTML = '';
  document.body.appendChild(container);
  return container;
};
