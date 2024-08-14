import { BlenderPythonDescribable } from './toBlenderPython'
import { toBlenderPython } from './toBlenderPython'

export class Collection implements BlenderPythonDescribable {
    name: string
    clearExisting: boolean

    constructor(name: string, clearExisting: boolean = true) {
        this.name = name
        this.clearExisting = clearExisting
    }

    link(object: any): string {
        return (
            toBlenderPython(object) +
            `
obj = bpy.context.active_object

# Unlink the object from all other collections (optional)
for collection in obj.users_collection:
    collection.objects.unlink(obj)

${this.name}.objects.link(obj)
`
        )
    }

    delete(): string {
        return `
collection_name = "${this.name}"
if collection_name in bpy.data.collections:
    collection = bpy.data.collections[collection_name]
    bpy.data.collections.remove(collection)
`
    }

    toBlenderPython(): string {
        const makeCollection = `
${this.name} = bpy.data.collections.new("${this.name}")
bpy.context.scene.collection.children.link(${this.name})
`
        if (this.clearExisting) {
            return this.delete() + makeCollection
        } else {
            return makeCollection
        }
    }
}
