import { Attribs, Cube, Plane } from 'root/geo'
import { Light } from './Light'
import { Camera } from './Camera'
import { Material } from './Material'

import { randomInt } from 'root/random'

export interface BlenderPythonDescribable {
    toBlenderPython(): string
}

export function toBlenderPython(obj: any): string | undefined {
    if (typeof obj === 'string') return obj

    if ('toBlenderPython' in obj) {
        return obj.toBlenderPython()
    }

    if (obj instanceof Cube) {
        return cubeToCode(obj as Cube)
    } else if (obj instanceof Plane) {
        return planeToCode(obj as Plane)
    } else if (obj instanceof Light) {
        const light = obj as Light
        return applyAttribs(light.attribs, light.toBlenderPython())
    } else if (obj instanceof Camera) {
        const camera = obj as Camera
        return applyAttribs(camera.attribs, camera.toBlenderPython())
    } else if (obj instanceof Material) {
        const mat = obj as Material
        return mat.toBlenderPython()
    }
    return undefined
}

function applyAttribs(attribs: Attribs, code: string): string {
    if (Object.keys(attribs).length == 0) return code

    let attribsCode = 'obj = bpy.context.active_object\n'

    if (attribs.name) {
        attribsCode += `obj.name = "${attribs.name}"\n`
    }
    // if (attribs.translation) {
    //     attribsCode += `obj.translate = (${attribs.rotation[0]}, ${attribs.rotation[1]}, ${attribs.rotation[2]})\n`
    // }
    if (attribs.rotation) {
        attribsCode += `obj.rotation_euler = (${attribs.rotation[0]}, ${attribs.rotation[1]}, ${attribs.rotation[2]})\n`
    }
    if (attribs.scale) {
        attribsCode += `obj.rotation_euler = (${attribs.scale[0]}, ${attribs.scale[1]}, ${attribs.scale[2]})\n`
    }

    return code + '\n' + attribsCode
}

function cubeToCode(cube: Cube): string {
    // https://docs.blender.org/api/current/bmesh.ops.html#bmesh.ops.create_cube
    const { size, attribs } = cube
    const center = cube.center

    const code = `
bm = bmesh.new()
bmesh.ops.create_cube(bm, size=1)
mesh_data = bpy.data.meshes.new("Cube")
bm.to_mesh(mesh_data)
bm.free()
mesh_obj = bpy.data.objects.new(mesh_data.name, mesh_data)
mesh_obj.location = (${center[0]}, ${center[1]}, ${center[2]})
bpy.context.collection.objects.link(mesh_obj)
mesh_obj.scale = (${size[0]}, ${size[1]}, ${size[2]})
bpy.context.view_layer.objects.active = mesh_obj
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
