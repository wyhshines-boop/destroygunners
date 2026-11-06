# Mecha Workshop prototype

Three source mechs: DA-01, XDA-01A, ETMLT-X. `extract.py` reads existing PSCa assets and captured part matrices; it does not contact a device. Geometry is split by original per-vertex component names, root transforms are removed, a uniform model scale is applied, and rigid joint anchors are embedded. All source triangles are retained. Left/right arms and legs keep individual attachment points while sharing UI controls.

`src/lib/workshop-core.mjs` assembles the same groups for the preview and GLB export. Per-slot tint, position and scale are included in exported materials/transforms. Cross-model seams are not guaranteed; adjustments are intentionally available. The original single-mesh public models are untouched.

Rebuild assets: `python3 scripts/model-workshop/extract.py` (Pillow required).
Verify: `node scripts/model-workshop/verify.mjs` then `npm run build`.
The check compares all source triangle counts against the existing published GLBs, reconstructs the original assemblies, checks hidden equipment/anchors/tint isolation, and uses the actual browser GLTFExporter to write an embedded-texture GLB. Test artifact: `/tmp/dgzz-workshop/DGZZ_Custom.glb`. Independent Blender import confirmed 7 meshes and 3 packed images.

Public routes: `/workshop`, `/zh/workshop`, `/ja/workshop`. Entry links are on the mecha catalog pages.
