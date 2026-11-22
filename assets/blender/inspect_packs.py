# Read-only inspection of the film's fan scene: pack roots, children, materials. Never saves.
import bpy, json, sys
sc = bpy.context.scene
sc.frame_set(510)
out = {}
for o in bpy.data.objects:
    if o.parent is None and o.type in ('EMPTY', 'MESH') and any(k in o.name.lower() for k in ('pack', 'shampoo', 'conditioner', 'kumkum', 'massage', 'face', 'mask', 'wash')):
        kids = [c for c in o.children_recursive]
        mats = sorted({s.material.name for c in [o] + kids if c.type == 'MESH' for s in c.material_slots if s.material})
        tris = sum(len(c.data.polygons) for c in [o] + kids if c.type == 'MESH')
        out[o.name] = dict(type=o.type, loc=[round(v, 3) for v in o.matrix_world.translation], rot=[round(v, 3) for v in o.matrix_world.to_euler()], dims=[round(v, 3) for v in o.dimensions], kids=[(c.name, c.type) for c in kids][:40], nkids=len(kids), mats=mats, polys=tris, hide=o.hide_render)
mat_nodes = {}
for name in sorted({m for v in out.values() for m in v['mats']}):
    m = bpy.data.materials[name]
    mat_nodes[name] = sorted({n.bl_idname for n in m.node_tree.nodes}) if m.use_nodes else []
print('@@JSON@@' + json.dumps(dict(packs=out, mats=mat_nodes, unit=sc.unit_settings.scale_length)))
