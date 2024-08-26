import { BlenderPythonDescribable } from './toBlenderPython'
import { Attribs } from 'root/geo'

export class Duplicate implements BlenderPythonDescribable {
    refName: string
    newName: string
    linked: Boolean
    attribs: Attribs

    constructor(refName: string, newName: string, linked = false, attribs: Attribs = {}) {
        this.refName = refName
        this.newName = newName
        this.linked = linked
        this.attribs = attribs
    }

    toBlenderPython(): string {
        return `
object_name = "${this.refName}"
obj = bpy.data.objects.get(object_name)
if obj:
    # Duplicate object without using bpy.ops
    duplicated_obj = obj.copy()
    duplicated_obj.data = obj.data.copy()
    bpy.context.collection.objects.link(duplicated_obj)

    # rename
    duplicated_obj.name = "${this.newName}"

    # Set the duplicated object as the active object and select it
    bpy.context.view_layer.objects.active = duplicated_obj
    duplicated_obj.select_set(True)
`
    }

    // DUPLICATE METHOD: slower, but space efficient?
    //     toBlenderPython(): string {
    //         return `
    // object_name = "${this.refName}"
    // obj = bpy.data.objects.get(object_name)
    // if obj:
    //     # Clear select and select this
    //     bpy.ops.object.select_all(action='DESELECT')
    //     bpy.context.view_layer.objects.active = obj
    //     obj.select_set(True)

    //     # Duplicate and select
    //     bpy.ops.object.duplicate(linked=${this.linked ? 'True' : 'False'})
    //     duplicated_obj = bpy.context.selected_objects[-1]
    //     bpy.context.view_layer.objects.active = duplicated_obj

    //     # rename
    //     duplicated_obj.name = "${this.newName}"
    // `
    //     }
}
