import type { Focus, mountScene } from '../components/v4/scene';

const focusForProject = new Map<string, Focus>([
  ['urban-uav', 'simulation'], ['traffic-monitoring', 'vision'], ['banking', 'banking'], ['mosaic-rag', 'mosaic'],
]);

export function initExhibition(root: HTMLElement) {
  const links = [...root.querySelectorAll<HTMLAnchorElement>('[data-exhibit-project]')];
  const panels = [...root.querySelectorAll<HTMLElement>('[data-exhibit-detail]')];
  const inspection = root.querySelector<HTMLElement>('[data-inspection]');
  const overview = root.querySelector<HTMLButtonElement>('[data-overview]');
  const toggle = root.querySelector<HTMLButtonElement>('[data-live-toggle]');
  const stage = root.querySelector<HTMLElement>('[data-scene]');
  const status = root.querySelector<HTMLElement>('[data-exhibit-status]');
  const traffic = root.dataset.traffic;
  const banking = root.dataset.banking;
  if (!inspection || !overview || !toggle || !stage || !status || !traffic || !banking) return;

  const mobile = matchMedia('(max-width: 760px), (pointer: coarse)');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let renderer: ReturnType<typeof mountScene> | undefined;
  let focus: Focus = 'overview';
  let timeout: ReturnType<typeof setTimeout>;
  let attempt = 0;

  function select(next: Focus) {
    focus = next;
    root.dataset.focus = next;
    inspection!.hidden = next === 'overview';
    let title = 'Exhibition overview';
    for (const panel of panels) {
      panel.hidden = focusForProject.get(panel.dataset.exhibitDetail ?? '') !== next;
      if (!panel.hidden) title = panel.querySelector('h2')?.textContent ?? title;
    }
    for (const link of links) {
      if (focusForProject.get(link.dataset.exhibitProject ?? '') === next) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
    status!.textContent = title;
    renderer?.render(next, motion.matches);
  }

  function stop(message?: string) {
    attempt += 1;
    clearTimeout(timeout);
    renderer?.dispose();
    renderer = undefined;
    stage!.hidden = true;
    root.dataset.mode = 'still';
    toggle!.disabled = false;
    toggle!.textContent = 'Enable live 3D';
    if (message) status!.textContent = message;
  }

  for (const link of links) {
    const next = focusForProject.get(link.dataset.exhibitProject ?? '');
    if (!next) continue;
    link.addEventListener('click', event => {
      if (event instanceof MouseEvent && (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return;
      event.preventDefault();
      select(next);
      if (mobile.matches) panels.find(panel => !panel.hidden)?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    });
  }
  overview.addEventListener('click', () => {
    const previous = links.find(link => link.hasAttribute('aria-current'));
    select('overview');
    previous?.focus();
  });
  const syncViewport = () => {
    toggle.hidden = mobile.matches;
    if (mobile.matches && root.dataset.mode !== 'still') stop();
  };
  syncViewport();
  mobile.addEventListener('change', syncViewport);
  motion.addEventListener('change', () => renderer?.render(focus, motion.matches));

  toggle.addEventListener('click', async () => {
    if (root.dataset.mode === 'live') { stop('Static exhibition shown.'); return; }
    try {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) { stop('WebGL is unavailable. Project selection is still available.'); return; }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    } catch {
      stop('WebGL is unavailable. Project selection is still available.');
      return;
    }
    const current = ++attempt;
    toggle.disabled = true;
    root.dataset.mode = 'loading';
    toggle.textContent = 'Preparing live scene…';
    try {
      const { mountScene } = await import('../components/v4/scene');
      if (current !== attempt) return;
      const failed = () => queueMicrotask(() => {
        if (current === attempt) stop('The live scene could not run. Project selection is still available.');
      });
      stage.hidden = false;
      timeout = setTimeout(failed, 15000);
      renderer = mountScene(stage, {
        src: traffic, bankingTexture: banking, initialFocus: focus, reduced: motion.matches,
        select, failed,
        ready: () => {
          if (current !== attempt) return;
          clearTimeout(timeout);
          root.dataset.mode = 'live';
          toggle.disabled = false;
          toggle.textContent = 'Return to cinematic still';
          status.textContent = 'Live 3D ready.';
        },
      });
    } catch {
      if (current === attempt) stop('The live scene could not load. Project selection is still available.');
    }
  });
}
