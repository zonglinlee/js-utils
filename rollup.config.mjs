import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

/**
 * output.format
 * amd – Asynchronous Module Definition, used with module loaders like RequireJS
 * cjs – CommonJS, suitable for Node and other bundlers (alias: commonjs)
 * es – Keep the bundle as an ES module file, suitable for other bundlers and inclusion as a <script type=module> tag in modern browsers (alias: esm, module)
 * iife – A self-executing function, suitable for inclusion as a <script> tag. (If you want to create a bundle for your application, you probably want to use this.). "iife" stands for "immediately-invoked Function Expression"
 * umd – Universal Module Definition, works as amd, cjs and iife all in one
 * system – Native format of the SystemJS loader (alias: systemjs)
 */
export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/bundle.min.js',
            format: 'umd',
            // 挂载在 window 对象上的命名空间
            name: 'JsUtils', // Necessary for iife/umd bundles that exports values in which case it is the global variable name representing your bundle.
            plugins: [terser()],
        },
        {
            file: 'dist/bundle.js',
            format: 'es',
            name: 'JsUtils',
            plugins: [terser()],
        },
    ],
    plugins: [commonjs(), typescript()],
}
