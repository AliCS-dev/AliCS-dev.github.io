export function initEngineeringWorkbench(root: HTMLElement) {
  const controls = Array.from(root.querySelectorAll<HTMLAnchorElement>('[data-artifact-select]'));
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-artifact-panel]'));
  const status = root.querySelector<HTMLElement>('[data-workbench-status]');
  if (controls.length === 0 || controls.length !== panels.length) return;

  function select(index: number, announce = false) {
    controls.forEach((control, position) => {
      if (position === index) control.setAttribute('aria-current', 'true');
      else control.removeAttribute('aria-current');
    });
    panels.forEach((panel, position) => { panel.hidden = position !== index; });
    if (announce && status) status.textContent = panels[index].querySelector('h3')?.textContent ?? '';
  }

  function selectionFromHash() {
    return panels.findIndex(panel => `#${panel.id}` === window.location.hash);
  }

  controls.forEach((control, index) => {
    control.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (control.getAttribute('aria-current') !== 'true') select(index, true);
    });
  });

  window.addEventListener('hashchange', () => {
    const index = selectionFromHash();
    if (index >= 0) select(index, true);
  });
  select(Math.max(0, selectionFromHash()));
  root.dataset.ready = '';
}
