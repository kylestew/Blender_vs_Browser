import { Cube } from 'root/geo'

export function toBlenderCode(obj: any): string | undefined {
    if (obj instanceof Cube) {
        return cubeToCode(obj as Cube)
    }
    return undefined
}

function cubeToCode(cube: Cube): string {
    // https://docs.blender.org/api/current/bpy.ops.mesh.html#bpy.ops.mesh.primitive_cube_add
    const { pos, size, attribs } = cube

    return `
bpy.ops.mesh.primitive_cube_add(location=(${pos[0]}, ${pos[1]}, ${pos[2]}), size=1)
cube = bpy.context.active_object
cube.scale = (${size[0]}, ${size[1]}, ${size[2]})
`
    // TODO: process attribs
}

// export class Cube implements BlenderPythonDescribable {
//     size: number
//     location: Vec3
//     rotation: Vec3
//     scale: Vec3
//     name: string

//     constructor(
//         size: number = 2.0,
//         location: Vec3 = [0, 0, 0],
//         rotation: Vec3 = [0, 0, 0],
//         scale: Vec3,
//         name: string = 'default'
//     ) {
//         this.size = size
//         this.location = location
//         this.rotation = rotation
//         this.scale = scale
//         this.name = name
//     }

//     toBlenderCode(): string {
//         return `

// # Get the reference to the newly created cube
// cube = bpy.context.active_object

// # Rename the cube
// cube.name = "${this.name}"

// # Update the scene
// bpy.context.view_layer.update()
//         `
//     }
// }
