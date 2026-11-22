"""Export the seven film packs as separate web GLBs.

Source: motion/Gloveda/build/D_real/tmp/fan/fan_t9b.blend (the approved film v7 scene), opened read-only:
this script never saves the .blend. Each pack is exported at the origin with its native orientation
(front label facing Blender -Y, which the glTF exporter maps to +Z, toward a default three.js camera).
Film-only effects (wet shells, water drops, emerge runners) are left out.

Run (background Blender, through the film's gpu_run lock):
  blender -b fan_t9b.blend --python export_pack_glbs.py -- <out_dir>
"""
import bpy, sys, os, json

out_dir = sys.argv[sys.argv.index("--") + 1]
os.makedirs(out_dir, exist_ok=True)

PACKS = {
    "gloveda-face-mask": "gloveda-face-mask",
    "gloveda-face-wash": "gloveda-face-wash",
    "gloveda-kumkumadi": "gloveda-kumkumadi-thailam",
    "gloveda-shampoo": "gloveda-shampoo",
    "gloveda-massage-oil": "gloveda-massage-oil",
    "gloveda-conditioner": "gloveda-conditioner",
    "gloveda-face-pack": "gloveda-face-pack",
}
SKIP_PREFIX = ("SP_", "EM_", "Wet", "WetShell", "WetBeads")

scene = bpy.context.scene
scene.frame_set(510)
report = {}

for root_name, handle in PACKS.items():
    root = bpy.data.objects[root_name]
    # Neutralise the film animation on the root (in memory only) and put the pack at the origin, upright.
    root.animation_data_clear()
    root.parent = None
    root.location = (0.0, 0.0, 0.0)
    root.rotation_mode = "XYZ"
    root.rotation_euler = (0.0, 0.0, 0.0)
    root.scale = (1.0, 1.0, 1.0)
    bpy.context.view_layer.update()

    keep = []
    for o in root.children_recursive:
        mats = [s.material.name for s in getattr(o, "material_slots", []) if s.material]
        if o.name.startswith(SKIP_PREFIX) or any(m.startswith(SKIP_PREFIX) for m in mats):
            continue
        if o.hide_render or o.type not in ("MESH", "EMPTY"):
            continue
        keep.append(o)

    bpy.ops.object.select_all(action="DESELECT")
    for o in [root] + keep:
        o.hide_set(False)
        o.hide_select = False
        o.select_set(True)
    bpy.context.view_layer.objects.active = root

    path = os.path.join(out_dir, f"{handle}.raw.glb")
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_animations=False,
        export_yup=True,
        export_cameras=False,
        export_lights=False,
        export_image_format="AUTO",
    )
    meshes = [o for o in keep if o.type == "MESH"]
    report[handle] = {
        "objects": [o.name for o in keep],
        "polygons": sum(len(o.data.polygons) for o in meshes),
        "materials": sorted({s.material.name for o in meshes for s in o.material_slots if s.material}),
        "images": sorted({n.image.name + f" {n.image.size[0]}x{n.image.size[1]}" for o in meshes for s in o.material_slots if s.material and s.material.use_nodes for n in s.material.node_tree.nodes if n.bl_idname == "ShaderNodeTexImage" and n.image}),
        "bytes": os.path.getsize(path),
    }

with open(os.path.join(out_dir, "export_report.json"), "w") as f:
    json.dump(report, f, indent=1)
print("EXPORT_DONE")
