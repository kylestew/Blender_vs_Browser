import { Attribs, Cube, Plane } from 'root/geo'
import { Light } from './light'
import { Camera } from './camera'

export function toBlenderCode(obj: any): string | undefined {
    if (obj instanceof Cube) {
        return cubeToCode(obj as Cube)
    } else if (obj instanceof Plane) {
        return planeToCode(obj as Plane)
    } else if (obj instanceof Light) {
        const light = obj as Light
        return applyAttribs(light.attribs, light.toBlenderCode())
    } else if (obj instanceof Camera) {
        const camera = obj as Camera
        return applyAttribs(camera.attribs, camera.toBlenderCode())
    }
    return undefined
}

function applyAttribs(attribs: Attribs, code: string): string {
    if (Object.keys(attribs).length == 0) return code

    let attribsCode = 'obj = bpy.context.active_object\n'

    if (attribs.name) {
        attribsCode += `obj.name = "${attribs.name}"\n`
    }
    if (attribs.rotation) {
        attribsCode += `obj.rotation_euler = (${attribs.rotation[0]}, ${attribs.rotation[1]}, ${attribs.rotation[2]})\n`
    }
    if (attribs.scale) {
        attribsCode += `obj.rotation_euler = (${attribs.scale[0]}, ${attribs.scale[1]}, ${attribs.scale[2]})\n`
    }

    return code + '\n' + attribsCode
}

function cubeToCode(cube: Cube): string {
    // https://docs.blender.org/api/current/bpy.ops.mesh.html#bpy.ops.mesh.primitive_cube_add
    const { pos, size, attribs } = cube

    const code = `
bpy.ops.mesh.primitive_cube_add(location=(${pos[0]}, ${pos[1]}, ${pos[2]}), size=1)
cube = bpy.context.active_object
cube.scale = (${size[0]}, ${size[1]}, ${size[2]}) # apply cube size
`
    return applyAttribs(attribs, code)
}

function planeToCode(plane: Plane): string {
    // https://docs.blender.org/api/current/bpy.ops.mesh.html#bpy.ops.mesh.primitive_plane_add
    const { pos, size, attribs } = plane

    const code = `
bpy.ops.mesh.primitive_plane_add(size=${size}, location=(${pos[0]}, ${pos[1]}, ${pos[2]}))
`
    return applyAttribs(attribs, code)
}
