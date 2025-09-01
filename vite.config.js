import { resolve } from 'path'
import { preview } from 'vite'

export default {
    base: '/ccsync-v1/',
    root: resolve(__dirname, 'src'),
    build: {
        outDir: '../dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src', 'index.html'),
                login: resolve(__dirname, 'src', 'pages', 'auth', 'login.html'),
                register: resolve(__dirname, 'src', 'pages', 'auth', 'register.html'),
                forgotPassword: resolve(__dirname, 'src', 'pages', 'auth', 'forgot-password.html'),
                dashboard: resolve(__dirname, 'src', 'pages', 'dashboard', 'index.html'),
                profile: resolve(__dirname, 'src', 'pages', 'profile', 'profile.html'),
            }
        }
    },
    server: {
        port: 5137
    },
    preview: {
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
    resolve: {
        alias: {
            '~bootstrap': 'node_modules/bootstrap',
            '~aos': 'node_modules/aos'
        }
    }
}