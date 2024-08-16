import { BlenderPythonDescribable } from './toBlenderPython'
import { Attribs } from 'root/geo'

export class Duplicate implements BlenderPythonDescribable {
    refName: string
    newName: string
    attribs: Attribs

    constructor(refName: string, newName: string, attribs: Attribs = {}) {
        this.refName = refName
        this.newName = newName
        this.attribs = attribs
    }

    toBlenderPython(): string {
        return `
object_name = "${this.refName}"
obj = bpy.data.objects.get(object_name)
if obj:
    # Clear select and select this
    bpy.ops.object.select_all(action='DESELECT')
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)

    # Duplicate and select
    bpy.ops.object.duplicate()
    duplicated_obj = bpy.context.selected_objects[-1]
    bpy.context.view_layer.objects.active = duplicated_obj

    # rename
    duplicated_obj.name = "${this.newName}"
`
    }
}
