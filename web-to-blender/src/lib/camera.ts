import { BlenderPythonDescribable } from '../blender_remote'
import { Vec3, Attribs } from 'root/geo'

export type CameraType = 'PERSP' | 'ORTHO'

export class Camera implements BlenderPythonDescribable {
    type: CameraType
    location: Vec3
    attribs: Attribs

    constructor(type: CameraType, location: Vec3, attribs: Attribs = {}) {
        this.type = type
        this.location = location
        this.attribs = attribs
    }

    toBlenderCode(): string {
        const locationStr = `(${this.location[0]}, ${this.location[1]}, ${this.location[2]})`
        return `
bpy.ops.object.camera_add(location=${locationStr})
bpy.context.object.data.type = '${this.type}'
        `
    }
}
