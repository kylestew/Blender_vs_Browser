import { Vec3 } from 'root/geo'
import { toBlenderPython } from './toBlenderPython'

export function wireframe(object: any): string {
    return toBlenderPython(object) + `bpy.context.object.modifiers.new(name="Wireframe", type='WIREFRAME')\n`
}

export function material(object: any, matName: string): string {
    return toBlenderPython(object) + `bpy.context.object.data.materials.append(bpy.data.materials["${matName}"])\n`
}

export function translate(object: any, offset: Vec3): string {
    return (
        toBlenderPython(object) +
        `
obj = bpy.context.active_object
obj.location.x += ${offset[0]}
obj.location.y += ${offset[1]}
obj.location.z += ${offset[2]}
`
    )
}

export function shadeSmooth(object: any): string {
    return (
        toBlenderPython(object) +
        `
obj = bpy.context.active_object

# Make sure we are in Object mode
if bpy.context.mode != 'OBJECT':
    bpy.ops.object.mode_set(mode='OBJECT')

# Apply smooth shading
bpy.ops.object.shade_smooth()

# Optional: Enable auto smooth and set an angle (if you need auto smooth)
obj.data.use_auto_smooth = True
obj.data.auto_smooth_angle = 1.0472  # 60 degrees in radians (adjust as needed)
`
    )
}

export function bevel(object: any, width = 0.1, segments = 3): string {
    return (
        toBlenderPython(object) +
        `
obj = bpy.context.active_object

# Add the Bevel modifier to the object
bevel_mod = obj.modifiers.new(name="Bevel", type='BEVEL')

# Set the bevel width
bevel_mod.width = ${width}

# Set the number of segments
bevel_mod.segments = ${segments}

# Set the bevel type (options: 'OFFSET', 'WIDTH', 'DEPTH', 'PERCENT')
bevel_mod.limit_method = 'ANGLE'

# Set the angle limit (in radians, if limit_method is 'ANGLE')
bevel_mod.angle_limit = 0.523599  # 30 degrees
`
    )
}

export function extrude(object: any, amount = 1.0): string {
    return (
        toBlenderPython(object) +
        `
obj = bpy.context.active_object
bpy.ops.object.mode_set(mode='EDIT')

# Deselect all, then select all faces
bpy.ops.mesh.select_all(action='DESELECT')
bpy.ops.mesh.select_all(action='SELECT')

# Perform the extrusion
bpy.ops.mesh.extrude_context_move( TRANSFORM_OT_translate={"value": (0, 0, ${amount})})

bpy.ops.object.mode_set(mode='OBJECT')
`
    )
}

export function solidify(object: any, thickness = 1.0, offset = 0.0): string {
    return (
        toBlenderPython(object) +
        `
obj = bpy.context.active_object

solidify_modifier = obj.modifiers.new(name="Solidify", type='SOLIDIFY')
solidify_modifier.offset = ${offset}
solidify_modifier.thickness = ${thickness}

bpy.context.view_layer.objects.active = obj
bpy.ops.object.modifier_apply(modifier=solidify_modifier.name)
`
    )
}

export function restOnXYPlane(object: any): string {
    return (
        toBlenderPython(object) +
        `
# Ensure the mesh is in edit mode to calculate min z coordinate
bpy.ops.object.mode_set(mode='EDIT')
bm = bmesh.from_edit_mesh(obj.data)

# Find the lowest Z point in the mesh
min_z = min(v.co.z for v in bm.verts)

# Translate object so that it rests on the XY plane
bpy.ops.object.mode_set(mode='OBJECT')
obj.location.z -= min_z

bpy.ops.object.transform_apply(location=True)

bpy.ops.object.mode_set(mode='OBJECT')
`
    )
}

// class Name implements Modifier {
//     // if (extras.name) {
//     //     this.queuedCode += `bpy.context.active_object.name = "${extras.name}"` + '\n'
//     // }
// }
