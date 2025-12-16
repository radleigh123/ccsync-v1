import { resolve } from 'path'
import { defineConfig } from "vite";

export default defineConfig({
    root: resolve(__dirname, 'src'),
    build: {
        outDir: resolve(__dirname, 'dist'),
        emptyOutDir: true,
        assetsDir: 'assets',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src', 'index.html'),
                designSystem: resolve(__dirname, 'src', 'design-system.html'),

                // ADMIN
                adminIndex: resolve(__dirname, 'src', 'pages', 'admin', 'index.html'),
                adminEditUser: resolve(__dirname, 'src', 'pages', 'admin', 'edit-user.html'),

                // AUTH
                login: resolve(__dirname, 'src', 'pages', 'auth', 'login.html'),
                register: resolve(__dirname, 'src', 'pages', 'auth', 'register.html'),
                forgotPassword: resolve(__dirname, 'src', 'pages', 'auth', 'forgot-password.html'),

                // HOME
                home: resolve(__dirname, 'src', 'pages', 'home', 'home.html'),

                homeEventPersonAdd: resolve(__dirname, 'src', 'pages', 'home', 'event', 'add-event-person.html'),
                homeEventAdd: resolve(__dirname, 'src', 'pages', 'home', 'event', 'add-event.html'),
                homeEventEdit: resolve(__dirname, 'src', 'pages', 'home', 'event', 'edit-event.html'),
                homeEventSingleView: resolve(__dirname, 'src', 'pages', 'home', 'event', 'view-event-single.html'),
                homeEventView: resolve(__dirname, 'src', 'pages', 'home', 'event', 'view-event.html'),

                homeMemberAdd: resolve(__dirname, 'src', 'pages', 'home', 'member', 'register-member.html'),
                homeMemberView: resolve(__dirname, 'src', 'pages', 'home', 'member', 'view-member.html'),

                homeOfficerAdd: resolve(__dirname, 'src', 'pages', 'home', 'officer', 'add-officer.html'),
                homeOfficerEdit: resolve(__dirname, 'src', 'pages', 'home', 'officer', 'edit-officer.html'),
                homeOfficerViewDetails: resolve(__dirname, 'src', 'pages', 'home', 'officer', 'view-officer-details.html'),
                homeOfficerView: resolve(__dirname, 'src', 'pages', 'home', 'officer', 'view-officer.html'),

                homeRequirementAddPerson: resolve(__dirname, 'src', 'pages', 'home', 'requirement', 'add-requirement-person.html'),
                homeRequirementAdd: resolve(__dirname, 'src', 'pages', 'home', 'requirement', 'add-requirement.html'),
                homeRequirementViewDetail: resolve(__dirname, 'src', 'pages', 'home', 'requirement', 'view-detail-requirement.html'),
                homeRequirementViewSingle: resolve(__dirname, 'src', 'pages', 'home', 'requirement', 'view-requirement-single.html'),
                homeRequirementView: resolve(__dirname, 'src', 'pages', 'home', 'requirement', 'view-requirement.html'),

                homeStudentDashboard: resolve(__dirname, 'src', 'pages', 'home', 'student', 'student-dashboard.html'),
                homeStudentFullView: resolve(__dirname, 'src', 'pages', 'home', 'student', 'studentFullView.html'),
                homeStudentProfile: resolve(__dirname, 'src', 'pages', 'home', 'student', 'studentProfile.html'),
                homeStudentOfficer: resolve(__dirname, 'src', 'pages', 'home', 'student', 'studentViewOfficer.html'),

                // PROFILE
                profile: resolve(__dirname, 'src', 'pages', 'profile', 'profile.html'),

                // SETTINGS
                settings: resolve(__dirname, 'src', 'pages', 'settings', 'settings.html')
            }
        }
    },
    server: {
        port: 5137,
        proxy: {
            '/ccsync-api-plain': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                rewrite: (path) => path
            }
        }
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