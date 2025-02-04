import { Attribs, Cube, Sphere, Plane, Polygon } from 'root/geo'

export interface BlenderPythonDescribable {
    toBlenderPython(): string
}

export function toBlenderPython(obj: any): string | undefined {
    if (typeof obj === 'string') return obj

    if ('toBlenderPython' in obj) {
        if ('attribs' in obj) {
            return applyAttribs(obj.attribs, obj.toBlenderPython())
        }
        return obj.toBlenderPython()
    }

    if (obj instanceof Cube) {
        return cubeToCode(obj as Cube)
    } else if (obj instanceof Sphere) {
        return sphereToCode(obj as Sphere)
    } else if (obj instanceof Plane) {
        return planeToCode(obj as Plane)
    } else if (obj instanceof Polygon) {
        return polygonToCode(obj as Polygon)
    }
    return undefined
}

function applyAttribs(attribs: Attribs, code: string): string {
    if (Object.keys(attribs).length == 0) return code

    // let attribsCode = 'obj = bpy.context.active_object\n'
    let attribsCode = 'obj = bpy.context.active_object\n'

    // if (attribs.name) {
    //     attribsCode += `obj.name = "${attribs.name}"\n`
    // }
    // if (attribs.translation) {
    //     attribsCode += `obj.translate = (${attribs.rotation[0]}, ${attribs.rotation[1]}, ${attribs.rotation[2]})\n`
    // }

    if (attribs.position) {
        attribsCode += `obj.location = (${attribs.position[0]}, ${attribs.position[1]}, ${attribs.position[2]})\n`
    }
    if (attribs.rotation) {
        attribsCode += `obj.rotation_euler = (${attribs.rotation[0]}, ${attribs.rotation[1]}, ${attribs.rotation[2]})\n`
    }
    if (attribs.scale) {
        attribsCode += `obj.scale = (${attribs.scale[0]}, ${attribs.scale[1]}, ${attribs.scale[2]})\n`
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

function sphereToCode(sphere: Sphere): string {
    // https://docs.blender.org/api/current/bpy.ops.mesh.html#bpy.ops.mesh.primitive_ico_sphere_add
    const { pos, r, subdivisions, attribs } = sphere

    const code = `
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=${subdivisions}, radius=${r}, location=(${pos[0]}, ${pos[1]}, ${pos[2]}))
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

function polygonToCode(poly: Polygon) {
    const { pts, attribs } = poly

    // Convert the points to Blender's vertices format
    const vertices = pts.map((pt) => `(${pt[0]}, ${pt[1]}, ${pt[2] || 0})`).join(',\n    ')

    // Create the Python code string with the converted vertices
    const code = `
# Step 1: Define the points of the polygon
vertices = [
    ${vertices}
]

# Define the edges and faces for the polygon
edges = []
faces = [${pts.map((_, i) => i).join(', ')}]

# Step 2: Create a new mesh and object
mesh = bpy.data.meshes.new("Polygon")
mesh.from_pydata(vertices, edges, [faces])
mesh.update()

obj = bpy.data.objects.new("Polygon", mesh)

# Link the object to the scene collection
bpy.context.collection.objects.link(obj)

bpy.context.view_layer.objects.active = obj
`

    return applyAttribs(attribs, code)
}
