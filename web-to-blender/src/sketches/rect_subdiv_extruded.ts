import { Rectangle, asPolygon, asPoints, Vec2, Polygon, scale } from 'root/geo'
import { random } from 'root/random'
import { lerp, lerpPt } from 'root/math'
import { createCanvas } from 'root/canvas'

import { BlenderRemote } from '../blender_remote'
import { Collection } from '../lib/Collection'
import { extrude, material, solidify, restOnXYPlane } from '../lib/modifiers'

// === 2D Workflow ================================================================
function splitBalancedTri(tri: Vec2[], splitPct: number): [Vec2[], Vec2[]] {
    // TODO: always split the longest side
    const [A, B, C] = tri
    const D = lerpPt(A, C, splitPct)
    return [
        [A, B, D],
        [B, C, D],
    ]
}

// def recurse_split(tri, cur_depth, hit_base_case_fn, split_pct_fn):
//     """
//     inputs:
//         - tri: current triangle to subdivide
//         - cur_depth: current recursion depth
//         - hit_base_case_fn: determines if we should have hit the base case and should stop recursion
//         - split_pct_fn: determines where to split triangle (passed to split function)
//     returns: bunch o triangles (to be flattened)
//     """
function recurseSplit(tri: Vec2[], curDepth: number): Vec2[][] {
    if (curDepth === 5) {
        return [tri]
    } else {
        const splitPct = random(0.2, 0.8)
        const newTris = splitBalancedTri(tri, splitPct)

        const a = recurseSplit(newTris[0], curDepth + 1)
        const b = recurseSplit(newTris[1], curDepth + 1)
        return [...a, ...b]
    }
}

const rect = new Rectangle([0, 0], [16, 16])

const [A, B, C, D] = asPoints(rect)
const triA = [A, B, C]
const triB = [A, D, C] // not correct

// console.log(A, B, C, D)

let tris = recurseSplit(triA, 0).map((pts) => new Polygon(pts))
tris.push(...recurseSplit(triB, 0).map((pts) => new Polygon(pts)))
// TODO: triB
// console.log(tris)

// scale all of them down
tris = tris.map((tri) => scale(tri, 0.995))

const cmd = createCanvas(1200, 1200, undefined, [-6.2, 6.2])
cmd.clear('white')
cmd.draw(tris, { stroke: '#000', weight: 0.03, lineCap: 'round', lineJoin: 'round' })
// ===============================================================================

// === 3D Workflow ================================================================
const remote = new BlenderRemote()
let outputCount = 0

const collection = new Collection('Tris')
remote.add(collection)

const mats = ['random', 'metal']

// spit out all tris to blender
tris.forEach((poly) => {
    const extruded = extrude(poly, random(0.5, 1.5))
    const final = material(extruded, 'random')

    remote.add(collection.link(final))
})

remote.flush()
console.log('Final count:', outputCount)
// ===============================================================================

/*
# recursive func
def recurse_split(tri, cur_depth, hit_base_case_fn, split_pct_fn):
    """
    inputs:
        - tri: current triangle to subdivide
        - cur_depth: current recursion depth
        - hit_base_case_fn: determines if we should have hit the base case and should stop recursion
        - split_pct_fn: determines where to split triangle (passed to split function)
    returns: bunch o triangles (to be flattened)
    """

    if hit_base_case_fn(cur_depth) == True:
        return tri
    else:
        new_tris = split_balanced_tri(tri, split_pct_fn)
        a = recurse_split(
            new_tris[0], cur_depth + 1, hit_base_case_fn, split_pct_fn
        )
        b = recurse_split(
            new_tris[1], cur_depth + 1, hit_base_case_fn, split_pct_fn
        )
        return np.array([a, b]).flatten()


DISTORTION = 0.2
SEED = 3
MIN_DEPTH = 0
MAX_DEPTH = 12

hit_base_case_fn = partial(
    non_deterministic_base_case, min=MIN_DEPTH, max=MAX_DEPTH
)
split_pct_fn = partial(split_uniform, DISTORTION, SEED)
recurseFn = partial(
    recurse_split,
    cur_depth=0,
    hit_base_case_fn=hit_base_case_fn,
    split_pct_fn=split_pct_fn,
)

TODO: 
https://depasquale.art/works/triangle-divider/

+ vary recursion depth based on image sampling / gradient / noise
+ Split decision Fn with some sort of intelligence
+ Fill instead of stroke
+ Non-triangle starting shapes
+ Interesting starting shapes
+ Splitting FN on quads instead
+ Curves
*/
