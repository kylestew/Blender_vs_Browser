import './style.css'

import { cleanScene, sendObjectToBlender } from './blender_remote'
import { Cube } from './lib'

let cube = new Cube(2.0, [1, 2, 3], [1, 2, 3], [1, 2, 3], 'hello world')

cleanScene()

sendObjectToBlender(cube)
