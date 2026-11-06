# Mecha Workshop prototype

All 23 source mechs are included, in catalog order. Variants sharing an internal model name retain separate captured poses and textures. `extract.py` reads existing PSCa assets and captured part matrices; it does not contact a device. Geometry is split by original per-vertex component names, root transforms are removed, a uniform model scale is applied, and rigid joint anchors are embedded. All source triangles are retained. Left/right arms and legs keep individual attachment points while sharing UI controls.

`src/lib/workshop-core.mjs` assembles the same groups for the preview and GLB export. Per-slot tint, position and scale are included in exported materials/transforms. Cross-model seams are not guaranteed; adjustments are intentionally available. The original single-mesh public models are untouched.

Rebuild assets: `python3 scripts/model-workshop/extract.py` (Pillow required).
Verify: `node scripts/model-workshop/verify.mjs` then `npm run build`.
The check compares all source triangle counts against the existing published GLBs, reconstructs the original assemblies, checks hidden equipment/anchors/tint isolation, and uses the actual browser GLTFExporter to write an embedded-texture GLB. Test artifact: `/tmp/dgzz-workshop/DGZZ_Custom.glb`. The check also exercises all 529 torso/donor pairings and textured export from the expanded roster. Independent Blender import of the initial mixed model confirmed 7 meshes and 3 packed images.

Models load on demand for the selected parts. Position offsets support ±1.5 units. These checks establish geometry and export integrity; cross-model visual seams still require manual adjustment. Unbound secondary texture slots use the captured body atlas, matching the existing single-atlas published models.

Public routes: `/workshop`, `/zh/workshop`, `/ja/workshop`. Entry links are on the mecha catalog pages.
