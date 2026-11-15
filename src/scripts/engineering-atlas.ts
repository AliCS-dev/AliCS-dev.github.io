import { atlasDisciplines, atlasProjects, type AtlasProjectId } from '../data/atlas';

type AtlasControl = HTMLAnchorElement | SVGAElement;

export function initEngineeringAtlas(root: HTMLElement) {
  const controls = [...root.querySelectorAll<AtlasControl>('[data-atlas-select], [data-atlas-project]')];
  const details = [...root.querySelectorAll<HTMLElement>('[data-atlas-detail]')];
  const edges = [...root.querySelectorAll<SVGPathElement>('[data-atlas-edge]')];
  const status = root.querySelector<HTMLElement>('[data-atlas-status]');
  const connections = atlasDisciplines.flatMap(discipline =>
    discipline.projects.map(project => ({ discipline: discipline.id, project })),
  );
  const keyFor = (control: AtlasControl) => control.dataset.atlasSelect ?? `project-${control.dataset.atlasProject}`;
  const keyFromHash = () => details.find(detail => location.hash === `#${detail.id}`)?.dataset.atlasDetail;
  let selected: string = keyFromHash() ?? atlasDisciplines[0].id;
  let hovered: string | null = null;
  let focused: string | null = null;

  function paint() {
    const active = hovered ?? focused ?? selected;
    const matches = connections.filter(({ discipline, project }) => active === discipline || active === `project-${project}`);
    const related = new Set(matches.flatMap(({ discipline, project }) => [discipline, `project-${project}`]));
    for (const control of controls) {
      control.toggleAttribute('data-active', related.has(keyFor(control)));
    }
    for (const edge of edges) {
      const highlighted = matches.some(({ discipline, project }) =>
        edge.dataset.discipline === discipline && edge.dataset.project === project,
      );
      edge.toggleAttribute('data-active', highlighted);
      edge.toggleAttribute('data-dim', !highlighted);
    }
  }

  function select(key: string, announce = false) {
    selected = key;
    for (const control of controls) {
      if (keyFor(control) === key) control.setAttribute('aria-current', 'true');
      else control.removeAttribute('aria-current');
    }
    for (const detail of details) detail.hidden = detail.dataset.atlasDetail !== key;
    if (announce && status) {
      const discipline = atlasDisciplines.find(({ id }) => id === key);
      const project = atlasProjects[key.slice('project-'.length) as AtlasProjectId];
      const title = discipline?.label ?? project?.title;
      if (title) status.textContent = `${title} selected. Details follow the diagram.`;
    }
    paint();
  }

  for (const control of controls) {
    const key = keyFor(control);
    control.addEventListener('pointerenter', event => {
      if ((event as PointerEvent).pointerType === 'touch') return;
      hovered = key;
      paint();
    });
    control.addEventListener('pointerleave', () => { hovered = null; paint(); });
    control.addEventListener('focus', () => { hovered = null; focused = key; paint(); });
    control.addEventListener('blur', () => { focused = null; paint(); });
    control.addEventListener('click', event => {
      if (event instanceof MouseEvent && (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return;
      event.preventDefault();
      hovered = null;
      select(key, key !== selected);
    });
  }

  window.addEventListener('hashchange', () => {
    const key = keyFromHash();
    if (key) {
      hovered = null;
      focused = null;
      select(key);
    }
  });
  select(selected);
  root.dataset.ready = '';
}
