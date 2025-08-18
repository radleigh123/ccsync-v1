# CCSync-V1 [Bootstrap + Vite]
*source:* https://getbootstrap.com/docs/5.3/getting-started/vite/

### Steps to replicate
```bash
npm install
npm run build
npm start
```

### Project structure
```
ccsync-v1/
│
├── src/
│   ├── index.html                # Main entry HTML
│   ├── pages/                    # All HTML pages (login, dashboard, etc.)
│   │   ├── auth/
│   │   │   └── login.html
│   │   ├── dashboard/
│   │   │   └── dashboard.html
│   │   └── ...                   # More page folders
│   ├── js/                       # JavaScript files
│   │   ├── main.js               # Main JS entry
│   │   ├── components/           
│   │   └── pages/                # JS specific to each page
│   ├── scss/                     # SCSS styles
│   │   ├── styles.scss           # Main SCSS entry
│   │   ├── components/           
│   │   ├── pages/                # SCSS for specific pages
│   │   └── ...                   # More SCSS files
│   └── assets/                   # Images, fonts, etc.
│
├── public/                       # Static files (if needed)
│
├── vite.config.js                # Vite config
├── package.json                  # NPM dependencies
└── README.md                     # Project documentation
```

