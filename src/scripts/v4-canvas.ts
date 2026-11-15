type Focus = 'overview' | 'simulation' | 'vision';

function supportsWebGL2() {
  try {
    const context = document.createElement('canvas').getContext('webgl2');
    context?.getExtension('WEBGL_lose_context')?.loseContext();
    return Boolean(context);
  } catch {
    return false;
  }
}

export function initCanvasStudy(study: HTMLElement) {
  const scene = study.querySelector<HTMLElement>('[data-v4-scene]');
  const enable = study.querySelector<HTMLButtonElement>('[data-v4-render]');
  const controls = [...study.querySelectorAll<HTMLElement>('[data-v4-focus]')];
  const overview = study.querySelector<HTMLButtonElement>('button[data-v4-focus]');
  const figures = [...study.querySelectorAll<HTMLElement>('.exhibit figure')];
  const status = study.querySelector<HTMLElement>('[data-v4-status]');
  const src = study.dataset.texture;
  if (!scene || !enable || !overview || !status || !src) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 760px), (pointer: coarse)');
  let renderer: ReturnType<typeof import('../components/v4/scene').mountScene> | undefined;
  let focus: Focus = 'simulation';
  let startupTimer: ReturnType<typeof setTimeout> | undefined;

  function select(next: Focus, announce = true) {
    focus = next;
    controls.forEach(control => {
      if (control === overview) control.setAttribute('aria-pressed', String(next === 'overview'));
      else if (control.dataset.v4Focus === next) control.setAttribute('aria-current', 'true');
      else control.removeAttribute('aria-current');
    });
    figures.forEach(figure => { figure.hidden = figure.id !== `v4-${next === 'overview' ? 'simulation' : next}`; });
    renderer?.render(next, motion.matches);
    if (announce) status!.textContent =
      next === 'overview' ? 'Scene overview.' : next === 'simulation' ? 'Urban UAV Logistics Simulation selected.' : 'Traffic and Crowd Monitoring selected.';
  }

  function staticMode(message = '') {
    clearTimeout(startupTimer);
    study.dataset.mode = 'static';
    scene!.hidden = true;
    overview!.hidden = true;
    renderer?.dispose();
    renderer = undefined;
    enable!.disabled = false;
    enable!.textContent = 'Enable interactive 3D';
    select(focus === 'overview' ? 'simulation' : focus, false);
    status!.textContent = message;
  }

  controls.forEach(control => control.addEventListener('click', event => {
    if (event instanceof MouseEvent && (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return;
    event.preventDefault();
    select(control.dataset.v4Focus as Focus);
  }));
  select(location.hash === '#v4-vision' ? 'vision' : 'simulation', false);
  window.addEventListener('hashchange', () => {
    if (location.hash === '#v4-vision') select('vision');
    if (location.hash === '#v4-simulation') select('simulation');
  });
  const syncLayout = () => {
    enable.parentElement!.hidden = mobile.matches;
    if (mobile.matches && study.dataset.mode !== 'static') staticMode();
  };
  syncLayout();
  mobile.addEventListener('change', syncLayout);
  motion.addEventListener('change', () => renderer?.render(focus, motion.matches));
  enable.addEventListener('click', async () => {
    if (study.dataset.mode === '3d') { staticMode('Original project imagery shown.'); return; }
    if (!supportsWebGL2()) { staticMode('WebGL 2 is unavailable. Original project imagery is shown.'); return; }
    enable.disabled = true;
    study.dataset.mode = 'loading';
    status.textContent = 'Preparing the 3D scene.';
    try {
      const { mountScene } = await import('../components/v4/scene');
      if (study.dataset.mode !== 'loading') return;
      scene.hidden = false;
      select('overview', false);
      const failed = () => queueMicrotask(() => staticMode('The 3D scene could not run. Original project imagery is shown.'));
      startupTimer = setTimeout(failed, 15000);
      renderer = mountScene(scene, {
        src, reduced: motion.matches,
        select: next => { if (next !== 'banking' && next !== 'mosaic') select(next); },
        ready: () => {
          if (study.dataset.mode !== 'loading') return;
          clearTimeout(startupTimer);
          study.dataset.mode = '3d';
          overview.hidden = false;
          enable.disabled = false;
          enable.textContent = 'Return to project imagery';
          status.textContent = '3D scene ready. Select a project to change perspective.';
        },
        failed,
      });
    } catch {
      staticMode('The 3D scene could not load. Original project imagery is shown.');
    }
  });
}
