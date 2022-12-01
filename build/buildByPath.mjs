import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

export default function buildByPath(targetDir, externalLib) {
    const __filename = fileURLToPath(import.meta.url)
    const dirName = path.join(path.dirname(__filename), `../src/${targetDir}/`)
    const dirContent = fs.readdirSync(dirName)
    console.log(__filename, dirName, dirContent)
    return dirContent.map((module) => {
        return {
            input: path.join(dirName, module),
            output: [
                {
                    dir: path.join(
                        path.dirname(__filename),
                        `../dist/es/${targetDir}/`
                    ),
                    format: 'es',
                },
            ],
            external: externalLib,
            plugins: [commonjs(), typescript()],
        }
    })
}
