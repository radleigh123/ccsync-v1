# CCSync [Bootstrap + Vite]

### Steps to replicate
```bash
npm install

# development
npm run dev
# production
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
├── vite.config.js
├── package.json
└── README.md
```

### Additionals
**Helpful plugins**
- **Todo Tree** (Gruntfuggly) - helps identify and list out TODOs
- **Bootstrap 5 Quick Snippets** (Anbuselvan Rocky) - helpful snippets for quick development

<br>

---
Documentation:
- https://getbootstrap.com/docs/5.3/getting-started/vite/