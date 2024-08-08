import './style.css'

// import { cleanScene, sendCodeToBlender, sendObjectToBlender } from './blender_remote'
import { toBlenderCode } from './lib'
// import { Cube, Curve } from './lib'
import { CubeGrid, Cube } from 'root/geo'

let cube = new Cube([0, 1, 2], [3, 4, 5])
cube.attribs = { name: 'hello cube', rotation: [1, 2, 3] }

console.log(cube)

console.log(toBlenderCode(cube))

// cleanScene()
// sendObjectToBlender(curve)

// let cube = new Cube(2.0, [1, 2, 3], [1, 2, 3], [1, 2, 3], 'hello world')

// const numPoints = 36
// const radius = 1

// const points: [number, number, number][] = []

// for (let i = 0; i < numPoints; i++) {
//     const angle = (2 * Math.PI * i) / numPoints
//     const x = radius * Math.cos(angle)
//     const y = radius * Math.sin(angle)
//     const z = 0 // Assuming the circle lies in the XY plane
//     points.push([x, y, z])
// }

// const curve = new Curve(points)

// # Add a sun lamp above the grid.
// bpy.ops.object.light_add(
//     type='SUN',
//     radius=1.0,
//     location=(0.0, 0.0, extents * 1.5))

// # Add an orthographic camera above the grid.
// # Rotate 45 degrees on the x-axis, 45 degrees on the z-axis; uses XYZ order.
// bpy.ops.object.camera_add(
//     location=(extents * 1.414, -extents * 1.414, extents * 2.121),
//     rotation=(0.785398, 0.0, 0.785398))
// bpy.context.object.data.type = 'ORTHO'
// bpy.context.object.data.ortho_scale = extents * 7.0

// # Create a ground.
// bpy.ops.mesh.primitive_plane_add(
//     size=extents * 15.0, location=(0.0, 0.0, -extents * 1.5))
// bpy.context.object.name = "Ground"
// mat = bpy.data.materials.new(name="Ground")
// mat.diffuse_color = (0.015, 0.015, 0.015, 1.0)
// bpy.context.object.data.materials.append(mat)
