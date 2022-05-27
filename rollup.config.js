import svelte from "rollup-plugin-svelte"
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import livereload from "rollup-plugin-livereload"
import { terser } from "rollup-plugin-terser"
// import css from "rollup-plugin-css-only"
import fs from "fs"
import path from "path"

const production = !process.env.ROLLUP_WATCH

function serve() {
    let server

    function toExit() {
        if (server) server.kill(0)
    }

    return {
        writeBundle() {
            if (server) return
            server = require("child_process").spawn(
                "npm",
                ["run", "start", "--", "--dev"],
                {
                    stdio: ["ignore", "inherit", "inherit"],
                    shell: true,
                }
            )

            process.on("SIGTERM", toExit)
            process.on("exit", toExit)
        },
    }
}

function inlineSvelte(template, dest) {
    return {
        name: "Svelte Inliner",
        generateBundle(opts, bundle) {
            const file = path.parse(opts.file).base
            const code = bundle[file].code

            const output = fs.readFileSync(template, "utf-8")

            /**
             * Option 1: Escape the <script> tags in the svelte code
             */
            // svelte has some code in script tags that it passes back and for
            // these need to be escaped when used in the head <script> tags
            code.replace("</scri", `<\/scri`)

            // then this escaped code can be inserted into our template placeholder
            bundle[file].code = output.replace("%%script%%", () => code)

            /**
             * Option 2: Base64 encode to avoid having to escape the <script> tags
             */
            // The other option is to encode code into base64
            // but the bundle size is 9x bigger
            // const base64 = Buffer.from(code).toString("base64")
            // bundle[file].code = output.replace("%%svelte64%%", () => base64)
        },
    }
}

export default {
    input: "src/main.js",
    output: {
        sourcemap: false,
        format: "iife",
        name: "app",
        file: "public/index.html",
    },
    plugins: [
        svelte({
            compilerOptions: {
                // enable run-time checks when not in production
                dev: !production,
            },
            emitCss: false,
        }),

        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration -
        // consult the documentation for details:
        // https://github.com/rollup/plugins/tree/master/packages/commonjs
        resolve({
            browser: true,
            dedupe: ["svelte"],
        }),
        commonjs(),

        inlineSvelte("./src/template.html"),

        // In dev mode, call `npm run start` once
        // the bundle has been generated
        !production && serve(),

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        !production && livereload("public"),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        // when terser isn't run, for some reason my code back slash escapes fail
        // so, always terse
        terser(),
    ],
    watch: {
        clearScreen: false,
    },
}
