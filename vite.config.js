import { resolve } from 'path'

export default {
    root: resolve(__dirname, 'src'),
    build: {
        outDir: '../dist'
    },
    server: {
        port: 5137
    },
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: [
                    'import',
                    'mixed-decls',
                    'color-functions',
                    'global-builtin',
                    'legacy-js-api',
                ],
            },
        },
    },
}