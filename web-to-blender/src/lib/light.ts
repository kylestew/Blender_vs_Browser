import { BlenderPythonDescribable } from '../blender_remote'
import { Vec3, Attribs } from 'root/geo'

export type LightType = 'SUN' | 'POINT' | 'SPOT' | 'AREA'

export class Light implements BlenderPythonDescribable {
    type: LightType
    radius: number
    location: Vec3
    attribs: Attribs

    constructor(type: LightType, radius: number, location: Vec3, attribs: Attribs = {}) {
        this.type = type
        this.radius = radius
        this.location = location
        this.attribs = attribs
    }

    toBlenderCode(): string {
        const locationStr = `(${this.location[0]}, ${this.location[1]}, ${this.location[2]})`
        return `bpy.ops.object.light_add(type='${this.type}', radius=${this.radius}, location=${locationStr})`
    }
}
