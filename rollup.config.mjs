import { join } from "path";
import alias from "rollup-plugin-alias";
import buble from "rollup-plugin-buble";
import babel from "rollup-plugin-babel";
import cjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

const isProduction = process.env.NODE_ENV === "production";
const cwd = __dirname;

const baseConfig = {
    "input": join(cwd, "src/index.ts"),
    "output": {
        "file": join(cwd, "dist/index.js")
        , "format": "cjs"
        , "sourcemap": true
        , "exports": "named"
    },
    "plugins": [
        resolve({
            "preferBuiltins": false
        })
        , cjs()
        , babel({
            "babelrc": false
            , "presets": [
                [
                    "@babel/preset-env", {
                        "modules": false
                    }
                ]
            ]
            , "plugins": [
                [
                    "import"
                    , {
                        "libraryName": "@x-drive/utils"
                        , "libraryDirectory": "dist/libs"
                        , "camel2DashComponentName": false
                    }
                    , "@x-drive/utils"
                ]
            ]
            , "include": "node_modules/@x-drive"
        })
        , typescript({
            "tsconfigOverride": {
                "compilerOptions": {
                    "preserveConstEnums": true
                }
            }
        })
        , buble()
        , isProduction && terser()
    ]
}

const umdConfig = {
    "input": baseConfig.input
    , "output": {
        "file": join(cwd, "dist/index.umd.js")
        , "format": "umd"
        , "sourcemap": false
        , "exports": "named"
        , "name": "xRequest"
    }
    , "plugins": [
        ...baseConfig.plugins
        , isProduction && terser()
    ]
}


const esmConfig = Object.assign({}, baseConfig, {
    "output": Object.assign({}, baseConfig.output, {
        "sourcemap": true
        , "format": "es"
        , "file": join(cwd, "dist/index.esm.js")
    })
    , "plugins": [
        babel({
            "babelrc": false,
            "presets": [
                [
                    "@babel/preset-env"
                    , {
                        "modules": false
                    }
                ]
            ],
            "plugins": [
                [
                    "import"
                    , {
                        "libraryName": "@x-drive/utils"
                        , "libraryDirectory": "dist/libs"
                        , "camel2DashComponentName": false
                    }
                    , "@x-drive/utils"
                ]
            ]
            , "include": "node_modules/@x-drive"

        })
        , alias({
            "entries": [
                {
                    "find": "@x-drive/utils"
                    , "replacement": join(cwd, "node_modules/@x-drive/utils/dist/index.esm")
                }
            ]
        })
        , typescript()
    ]
})

function rollup() {
    return [baseConfig, umdConfig, esmConfig];
}
export default rollup;
