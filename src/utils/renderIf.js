import isFunction from 'lodash/isFunction';

export default function renderIf(condition, componentToRender, defaultComponent = null) {
  if (!condition) return isFunction(defaultComponent) ? defaultComponent() : defaultComponent;
  return isFunction(componentToRender) ? componentToRender() : componentToRender;
}
