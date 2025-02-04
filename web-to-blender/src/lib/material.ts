import { BlenderPythonDescribable } from './toBlenderPython'
import { Color } from './types'

export class Material implements BlenderPythonDescribable {
    name: string
    diffuseColor: Color

    constructor(name: string, diffuseColor: Color) {
        this.name = name
        this.diffuseColor = diffuseColor
    }

    toBlenderPython(): string {
        const diffColor = `(${this.diffuseColor[0]}, ${this.diffuseColor[1]}, ${this.diffuseColor[2]}, ${this.diffuseColor[3]})`
        return `
${this.name} = bpy.data.materials.new(name="${this.name}")
${this.name}.diffuse_color = ${diffColor}
        `
    }
}
