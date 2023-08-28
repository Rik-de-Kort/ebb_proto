import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig} from 'vitest/config';
import {getPyodideAssets} from "./vite-plugin-pyodide.js";
import {viteStaticCopy} from 'vite-plugin-static-copy';
import {searchForWorkspaceRoot} from "vite";

export default defineConfig({
    build: {
        outDir: "../../dist",
        emptyOutDir: true,
    },
    plugins: [
        sveltekit(),
        viteStaticCopy({
            targets: getPyodideAssets("src/python"),
        }),
    ],
    server: {
        fs: {
            allow: [
                searchForWorkspaceRoot(process.cwd()),
                'pyodide-data',
            ]
        }
    },
    test: {
        include: ['src/**/*.{test,spec}.{js,ts}']
    }
});
