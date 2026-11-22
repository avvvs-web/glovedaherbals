"""Write the f510 camera and each pack's world transform (film v7 scene) as JSON for the website's live 3D line-up.

Read-only: opens fan_t9b.blend in background Blender and never saves it.
Coordinates are converted from Blender (Z up) to glTF / three.js (Y up): (x, y, z) -> (x, z, -y).
Run: blender -b fan_t9b.blend --python export_lineup_camera.py -- <out.json>
"""
import bpy, sys, json, math
from mathutils import Matrix

out = sys.argv[sys.argv.index("--") + 1]
scene = bpy.context.scene
scene.frame_set(510)
dg = bpy.context.evaluated_depsgraph_get()

# Blender Z-up -> Y-up basis change (same as the glTF exporter).
C = Matrix(((1, 0, 0, 0), (0, 0, 1, 0), (0, -1, 0, 0), (0, 0, 0, 1)))

def to_yup(m):
    return C @ m @ C.inverted()

cam = scene.camera
cd = cam.data
r = scene.render
cam_m = to_yup(cam.matrix_world)
data = {
    "frame": 510,
    "render": {"x": r.resolution_x, "y": r.resolution_y, "pixel_aspect": r.pixel_aspect_x / r.pixel_aspect_y},
    "camera": {
        "matrix": [v for row in cam_m.transposed() for v in row],  # column-major for three.js Matrix4.fromArray
        "lens": cd.lens,
        "sensor_width": cd.sensor_width,
        "sensor_height": cd.sensor_height,
        "sensor_fit": cd.sensor_fit,
        "shift_x": cd.shift_x,
        "shift_y": cd.shift_y,
        "clip_start": cd.clip_start,
        "clip_end": cd.clip_end,
        "type": cd.type,
    },
    "packs": {},
}
for name in ("gloveda-face-mask", "gloveda-face-wash", "gloveda-kumkumadi", "gloveda-shampoo", "gloveda-massage-oil", "gloveda-conditioner", "gloveda-face-pack"):
    o = bpy.data.objects[name]
    m = to_yup(o.evaluated_get(dg).matrix_world)
    data["packs"][name] = [v for row in m.transposed() for v in row]

with open(out, "w") as f:
    json.dump(data, f, indent=1)
print("LINEUP_DONE", cd.lens, cd.sensor_fit, cd.shift_x, cd.shift_y)
