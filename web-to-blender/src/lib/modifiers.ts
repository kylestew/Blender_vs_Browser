import { toBlenderPython } from './toBlenderPython'

export function wireframe(object: any): string {
    return toBlenderPython(object) + `bpy.context.object.modifiers.new(name="Wireframe", type='WIREFRAME')\n`
}

export function material(object: any, matName: string): string {
    return toBlenderPython(object) + `bpy.context.object.data.materials.append(bpy.data.materials["${matName}"])\n`
}

export function shadeSmooth(object: any): string {
    return (
        toBlenderPython(object) +
        `
# Assuming you already have an active object selected
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

// class Name implements Modifier {
//     // if (extras.name) {
//     //     this.queuedCode += `bpy.context.active_object.name = "${extras.name}"` + '\n'
//     // }
// }
