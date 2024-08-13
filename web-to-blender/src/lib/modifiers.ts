import { toBlenderPython } from './toBlenderPython'

export function wireframe(object: any): string {
    return toBlenderPython(object) + `bpy.context.object.modifiers.new(name="Wireframe", type='WIREFRAME')\n`
}

export function material(object: any, matName: string): string {
    return toBlenderPython(object) + `bpy.context.object.data.materials.append(bpy.data.materials["${matName}"])\n`
}

// class Name implements Modifier {
//     // if (extras.name) {
//     //     this.queuedCode += `bpy.context.active_object.name = "${extras.name}"` + '\n'
//     // }
// }
