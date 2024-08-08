// https://docs.blender.org/api/current/bpy.ops.mesh.html#bpy.ops.mesh.primitive_cube_add
import { BlenderPythonDescribable } from '../blender_remote'
import { Vec3 } from './types'

export class Cube implements BlenderPythonDescribable {
    size: number
    location: Vec3
    rotation: Vec3
    scale: Vec3
    name: string

    constructor(
        size: number = 2.0,
        location: Vec3 = [0, 0, 0],
        rotation: Vec3 = [0, 0, 0],
        scale: Vec3,
        name: string = 'default'
    ) {
        this.size = size
        this.location = location
        this.rotation = rotation
        this.scale = scale
        this.name = name
    }

    toBlenderCode(): string {
        return `
import bpy

# Create a new cube
bpy.ops.mesh.primitive_cube_add(size=${this.size}, location=(${this.location[0]}, ${this.location[1]}, ${this.location[2]}), rotation=(${this.rotation[0]}, ${this.rotation[1]}, ${this.rotation[2]}), scale=(${this.scale[0]}, ${this.scale[1]}, ${this.scale[2]}))

# Get the reference to the newly created cube
cube = bpy.context.active_object

# Rename the cube
cube.name = "${this.name}"

# Update the scene
bpy.context.view_layer.update()
        `
    }
}
