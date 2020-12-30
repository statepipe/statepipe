export const render = html => {
  let id = `test-${Date.now()}-${Math.random().toString().match(/\d+/)[0]}`;
  const container = document.createElement('div');
  container.setAttribute('id', id);
  container.innerHTML = html;
  document.body.innerHTML = '';
  document.body.appendChild(container);
  return container;
};
