import bpy, json
s=bpy.context.scene; v=s.view_settings
print('@@'+json.dumps(dict(view=v.view_transform, look=v.look, exposure=v.exposure, gamma=v.gamma, engine=s.render.engine)))
