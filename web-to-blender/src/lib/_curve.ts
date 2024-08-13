import { BlenderPythonDescribable } from '../blender_remote'
import { Vec3 } from './types'

export class Curve implements BlenderPythonDescribable {
    vertices: Vec3[]
    location: Vec3
    rotation: Vec3
    scale: Vec3
    name: string

    constructor(
        vertices: Vec3[],
        location: Vec3 = [0, 0, 0],
        rotation: Vec3 = [0, 0, 0],
        scale: Vec3 = [1, 1, 1],
        name: string = 'default'
    ) {
        this.vertices = vertices
        this.location = location
        this.rotation = rotation
        this.scale = scale
        this.name = name
    }

    toBlenderCode(): string {
        const verticesCode = this.vertices.map((v) => `(${v[0]}, ${v[1]}, ${v[2]})`).join(',\n    ')

        return `
import bpy
import mathutils

# Define the vertices for the curve
vertices = [
    ${verticesCode}
]

# Create a new curve data block
curve_data = bpy.data.curves.new(name='${this.name}', type='CURVE')
curve_data.dimensions = '3D'

# Create a new spline in the curve
spline = curve_data.splines.new(type='POLY')
spline.points.add(len(vertices) - 1)

# Assign the vertices to the spline points
for i, vertex in enumerate(vertices):
    x, y, z = vertex
    spline.points[i].co = (x, y, z, 1)  # The fourth value is the weight

# Create a new object with the curve data
curve_object = bpy.data.objects.new('${this.name}', curve_data)

# Set object location, rotation, and scale
curve_object.location = (${this.location[0]}, ${this.location[1]}, ${this.location[2]})
curve_object.rotation_euler = (${this.rotation[0]}, ${this.rotation[1]}, ${this.rotation[2]})
curve_object.scale = (${this.scale[0]}, ${this.scale[1]}, ${this.scale[2]})

# Link the object to the scene
bpy.context.collection.objects.link(curve_object)

# Optionally, set the curve object as the active object
bpy.context.view_layer.objects.active = curve_object

# Update the scene
bpy.context.view_layer.update()
        `
    }
}
