"""Render the f510 background plate for the website's live 3D handoff.

Same scene and settings as the approved film frame (T9B_fan/0510: Cycles OptiX, 256 max / 32 min samples,
adaptive threshold 0.02, static seed), but every pack object is invisible to CAMERA rays only. The packs
still cast shadows and still appear in glossy reflections on the floor, so the plate keeps their reflections
while the live three.js packs are drawn on top. Never saves the .blend.
Run: blender -b fan_t9b.blend --python render_f510_plate.py -- <out.png>
"""
import bpy, sys, os

out = sys.argv[sys.argv.index("--") + 1]
prefs = bpy.context.preferences.addons["cycles"].preferences
prefs.compute_device_type = "OPTIX"
prefs.get_devices()
for d in prefs.devices:
    d.use = d.type == "OPTIX"
assert any(d.use for d in prefs.devices), "no OptiX device"
sc = bpy.context.scene
sc.cycles.device = "GPU"
sc.render.resolution_percentage = 100
sc.cycles.samples = 256
sc.cycles.adaptive_min_samples = 32
sc.cycles.adaptive_threshold = 0.02
sc.cycles.use_animated_seed = False
sc.frame_set(510)

packs = bpy.data.collections["Packs"]
hidden = 0
for o in packs.all_objects:
    o.visible_camera = False
    hidden += 1
print("[plate] camera-hidden objects:", hidden, flush=True)

sc.render.filepath = out
bpy.ops.render.render(write_still=True)
print("PLATE_DONE", out, flush=True)
