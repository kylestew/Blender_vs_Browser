import { BlenderPythonDescribable } from '../blender_remote'

class Modifier implements BlenderPythonDescribable {
    obj: any

    constructor(obj: any) {
        this.obj = obj
    }

    static wireframe(obj: any): Modifier {
        return new Modifier(obj)
    }

    toBlenderCode(): string {
        return `bpy.context.object.modifiers.new(name="Wireframe", type='WIREFRAME')`
    }
}

export { Modifier }
