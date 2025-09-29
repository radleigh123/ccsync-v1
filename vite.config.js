import { resolve } from 'path'
import { defineConfig } from "vite";

export default defineConfig({
    base: '/ccsync-v1/',
    root: resolve(__dirname, 'src'),
    build: {
        outDir: resolve(__dirname, 'dist'),
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src', 'index.html'),
                login: resolve(__dirname, 'src/pages/auth/login.html'),
                register: resolve(__dirname, 'src', 'pages', 'auth', 'register.html'),
                forgotPassword: resolve(__dirname, 'src', 'pages', 'auth', 'forgot-password.html'),
                profile: resolve(__dirname, 'src', 'pages', 'profile', 'profile.html'),
                home: resolve(__dirname, 'src', 'pages', 'home', 'home.html'),
                homeMemberAdd: resolve(__dirname, 'src', 'pages', 'home', 'member', 'register-member.html'),
                homeMemberView: resolve(__dirname, 'src', 'pages', 'home', 'member', 'view-member.html'),
                homeEventAdd: resolve(__dirname, 'src', 'pages', 'home', 'event', 'add-event.html'),
                homeEventView: resolve(__dirname, 'src', 'pages', 'home', 'event', 'view-event.html'),
                homeEventEdit: resolve(__dirname, 'src', 'pages', 'home', 'event', 'edit-event.html'),
                homeEventPersonAdd: resolve(__dirname, 'src', 'pages', 'home', 'event', 'add-event-person.html'),
                homeEventSingleView: resolve(__dirname, 'src', 'pages', 'home', 'event', 'view-event-single.html'),
                homeRequirementAdd: resolve(__dirname, 'src', 'pages', 'home', 'requirement', 'add-requirement.html'),
                homeRequirementView: resolve(__dirname, 'src', 'pages', 'home', 'requirement', 'view-requirement.html'),
                homeOfficerAdd: resolve(__dirname, 'src', 'pages', 'home', 'officer', 'add-officer.html'),
                homeOfficerView: resolve(__dirname, 'src', 'pages', 'home', 'officer', 'view-officer.html'),
                settings: resolve(__dirname, 'src', 'pages', 'settings', 'settings.html'),
                designSystem: resolve(__dirname, 'src', 'design-system.html'),
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
    /* resolve: {
        alias: {
            '~bootstrap': 'node_modules/bootstrap',
            '~aos': 'node_modules/aos',
            '~intl-tel-input': 'node_modules/intl-tel-input'
        }
    } */
})