import './style.css'

import { cleanScene, sendCodeToBlender, sendObjectToBlender } from './blender_remote'
import { Cube, Curve } from './lib'

let cube = new Cube(2.0, [1, 2, 3], [1, 2, 3], [1, 2, 3], 'hello world')

const numPoints = 36
const radius = 1

const points: [number, number, number][] = []

for (let i = 0; i < numPoints; i++) {
    const angle = (2 * Math.PI * i) / numPoints
    const x = radius * Math.cos(angle)
    const y = radius * Math.sin(angle)
    const z = 0 // Assuming the circle lies in the XY plane
    points.push([x, y, z])
}

const curve = new Curve(points)

cleanScene()
sendObjectToBlender(curve)

/*
def gen_perlin_curve():

    bpy.ops.mesh.primitive_circle_add(vertices=512, radius=1)
    circle = active_object()

    deform_coords = []

    for vert in circle.data.vertices:
        new_location = vert.co
        noise_value = mathutils.noise.noise(new_location)
        noise_value = noise_value / 2

        deform_vector = vert.co * noise_value

        deform_coord = vert.co + deform_vector
        deform_coords.append(deform_coord)

    bpy.ops.object.convert(target="CURVE")
    curve_obj = active_object()
   */
