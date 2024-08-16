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
    # Duplicate the object using the data API instead of bpy.ops
    duplicated_obj = obj.copy()
    duplicated_obj.data = obj.data.copy()  # Use linked data instead of copying mesh data if desired
    bpy.context.collection.objects.link(duplicated_obj)

    # Rename the duplicated object
    duplicated_obj.name = "copy_5"

    # Set the duplicated object as the active object and select it
    bpy.context.view_layer.objects.active = duplicated_obj
    duplicated_obj.select_set(True)
`
        // ABOVE faster than below
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
    }
}
