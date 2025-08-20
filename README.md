# CCSync [Bootstrap + Vite]

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
│   │   │   └── register.html
│   │   │   └── forgot-password.html
│   │   ├── dashboard/
│   │   │   └── dashboard.html
│   ├── js/
│   │   ├── main.js               # Main JS entry
│   │   ├── components/           
│   │   └── pages/                # JS specific to each page
│   ├── scss/
│   │   ├── styles.scss           # Main SCSS entry
│   │   ├── components/           
│   │   ├── pages/                # SCSS for specific pages
│   └── assets/                   # Images, fonts, etc.
│
├── public/                       # Static files (if needed)
│
├── vite.config.js                # Vite config
├── package.json                  # NPM dependencies
└── README.md                     # Project documentation
```

---
Documentation:
- https://getbootstrap.com/docs/5.3/getting-started/vite/