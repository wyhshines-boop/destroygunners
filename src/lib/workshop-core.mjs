import { Group, Vector3, Box3 } from 'three';
export const parts = { torso: ['torso'], head: ['head'], arms: ['leftArm', 'rightArm'], legs: ['leftLeg', 'rightLeg'], back: ['back'] };
export function defaultSettings(id) {
  return Object.fromEntries(Object.keys(parts).map(slot => [slot, { source: id, color: '#ffffff', x: 0, y: 0, z: 0, scale: 1 }]));
}
export function assemble(templates, catalog, settings) {
  const body = catalog.find(model => model.id === settings.torso.source);
  if (!body) throw new Error('Missing torso');
  const assembly = new Group(); assembly.name = 'DGZZ_Custom';
  for (const [slot, names] of Object.entries(parts)) {
    const config = settings[slot]; if (config.source === 'none') continue;
    const template = templates.get(config.source); if (!template) throw new Error('Missing model: ' + config.source);
    const meshes = []; template.traverse(node => { if (node.isMesh && names.includes(node.userData.part)) meshes.push(node); });
    if (!meshes.length) continue;
    const pivot = new Vector3(); for (const name of names) pivot.add(new Vector3(...body.anchors[name])); pivot.divideScalar(names.length);
    const group = new Group(); group.name = `${slot}_${config.source}`;
    group.userData = { part: slot, source: config.source, tint: config.color };
    group.position.copy(pivot).add(new Vector3(config.x, config.y, config.z)); group.scale.setScalar(config.scale);
    for (const source of meshes) {
      const mesh = source.clone(false); mesh.geometry = source.geometry;
      mesh.material = source.material.clone(); mesh.material.color.set(config.color);
      mesh.position.set(...body.anchors[source.userData.part]).sub(pivot);
      group.add(mesh);
    }
    assembly.add(group);
  }
  assembly.updateMatrixWorld(true); return assembly;
}
export function releaseAssembly(assembly) { assembly.traverse(node => { if (node.isMesh) node.material.dispose(); }); }
export function bounds(assembly) { return new Box3().setFromObject(assembly); }
