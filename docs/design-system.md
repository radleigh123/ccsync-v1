# CCSync Design System

This documentation provides an overview of the design system implemented for the CCSync project. The design system aims to create a consistent, responsive, and accessible user interface across all pages of the application.

## Table of Contents

1. [Colors](#colors)
2. [Typography](#typography)
3. [Spacing](#spacing)
4. [Components](#components)
5. [Utilities](#utilities)
6. [Responsiveness](#responsiveness)
7. [Accessibility](#accessibility)

## Colors

The CCSync color system is based on the following palette:

- **Primary**: `#0D6EFD` - Main brand color used for primary actions and emphasis
- **Primary Dark**: Darker shade of primary for hover states
- **Primary Light**: Lighter shade of primary for backgrounds and subtle elements

- **Neutral Colors**:
  - Dark: `#212529`
  - Gray scale: From Gray-900 (`#212529`) to Gray-100 (`#f8f9fa`)
  - White: `#ffffff`

- **Semantic Colors**:
  - Success: `#28a745`
  - Danger: `#dc3545`
  - Warning: `#ffc107`
  - Info: `#17a2b8`

### Usage

```scss
// Examples
.bg-primary-ccsync {
  background-color: $primary-ccsync;
}

.text-primary-ccsync {
  color: $primary-ccsync;
}
```

## Typography

The CCSync typography system uses the following fonts:

- **Font Family**: 'Inter', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
- **Base Font Size**: 1rem (16px)
- **Font Weights**:
  - Normal: 400
  - Medium: 500
  - Semibold: 600
  - Bold: 700

### Headings

```html
<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<h6>Heading 6</h6>
```

### Text Styles

```html
<p>Regular paragraph text</p>
<p class="lead">Lead paragraph for introductions</p>
<p class="small">Small text for captions or notes</p>
```

### Text Utilities

```html
<p class="text-start">Left aligned text</p>
<p class="text-center">Center aligned text</p>
<p class="text-end">Right aligned text</p>

<p class="text-primary-ccsync">Primary color text</p>
<p class="text-muted">Muted text</p>

<p class="fw-normal">Normal weight text</p>
<p class="fw-bold">Bold text</p>
```

## Spacing

The spacing system is based on a 1rem (16px) base value with consistent increments:

- **0**: 0
- **1**: 0.25rem (4px)
- **2**: 0.5rem (8px)
- **3**: 1rem (16px)
- **4**: 1.5rem (24px)
- **5**: 3rem (48px)
- **6**: 4rem (64px)
- **7**: 5rem (80px)

### Usage

```html
<!-- Margin utilities -->
<div class="m-3">Margin on all sides</div>
<div class="mt-3">Margin top</div>
<div class="mb-3">Margin bottom</div>
<div class="ms-3">Margin left (start)</div>
<div class="me-3">Margin right (end)</div>
<div class="mx-3">Margin left and right</div>
<div class="my-3">Margin top and bottom</div>

<!-- Padding utilities -->
<div class="p-3">Padding on all sides</div>
<div class="pt-3">Padding top</div>
<div class="pb-3">Padding bottom</div>
<!-- and so on... -->
```

## Components

CCSync includes custom-styled components built on top of Bootstrap components.

### Cards

```html
<div class="card">
  <div class="card-header">Header</div>
  <div class="card-body">
    <h5 class="card-title">Card Title</h5>
    <p class="card-text">Card content goes here.</p>
  </div>
  <div class="card-footer">Footer</div>
</div>

<!-- Elevated card -->
<div class="card card-elevated">
  <!-- Content -->
</div>

<!-- Card with accent color -->
<div class="card card-primary">
  <!-- Content -->
</div>
```

### Buttons

```html
<!-- Primary brand button -->
<button class="btn btn-primary-ccsync">Primary Button</button>

<!-- Outline button -->
<button class="btn btn-outline-primary-ccsync">Outline Button</button>

<!-- Icon button -->
<button class="btn btn-primary-ccsync btn-icon">
  <i class="bi bi-check"></i> With Icon
</button>

<!-- Icon-only button -->
<button class="btn btn-primary-ccsync btn-icon btn-icon-only">
  <i class="bi bi-gear"></i>
</button>
```

### Forms

```html
<form>
  <div class="mb-3">
    <label for="inputExample" class="form-label">Label</label>
    <input type="text" class="form-control" id="inputExample" placeholder="Placeholder">
  </div>
</form>
```

## Utilities

CCSync includes various utility classes for common styling needs.

### Display

```html
<div class="d-flex">Flex container</div>
<div class="d-none">Hidden element</div>
<div class="d-block">Block element</div>
<!-- and more... -->
```

### Flex

```html
<div class="d-flex flex-row">Row direction</div>
<div class="d-flex flex-column">Column direction</div>
<div class="d-flex justify-content-between">Space between items</div>
<div class="d-flex align-items-center">Center aligned items</div>
```

### Text

```html
<p class="text-truncate">Truncated text with ellipsis...</p>
<p class="text-nowrap">Text that doesn't wrap</p>
<p class="text-break">Text that breaks words if needed</p>
```

## Responsiveness

The CCSync design system is built with a mobile-first approach with breakpoints at:

- **xs**: 0px (default)
- **sm**: 576px
- **md**: 768px
- **lg**: 992px
- **xl**: 1200px
- **xxl**: 1400px

### Responsive Utilities

```html
<!-- Show only on mobile -->
<div class="d-block d-md-none">Mobile only</div>

<!-- Show only on desktop -->
<div class="d-none d-md-block">Desktop only</div>

<!-- Responsive direction -->
<div class="flex-direction-responsive">
  <!-- Column on mobile, row on desktop -->
</div>
```

### Responsive Grid

```html
<div class="row">
  <div class="col-12 col-md-6 col-lg-4">
    <!-- Full width on mobile, half width on tablet, one-third on desktop -->
  </div>
</div>
```

## Accessibility

The CCSync design system follows accessibility best practices:

1. **Color Contrast**: All text meets WCAG 2.1 AA contrast requirements
2. **Focus Styles**: Visible focus indicators for keyboard navigation
3. **Screen Reader Support**: Proper aria attributes and semantic HTML
4. **Keyboard Navigation**: All interactive elements are keyboard accessible

### Accessibility Attributes

```html
<!-- Example of accessible button with icon -->
<button class="btn btn-primary-ccsync" aria-label="Settings">
  <i class="bi bi-gear" aria-hidden="true"></i>
</button>

<!-- Example of accessible form field -->
<div class="mb-3">
  <label for="nameInput" class="form-label">Name</label>
  <input 
    type="text" 
    class="form-control" 
    id="nameInput" 
    aria-describedby="nameHelp"
    required
  >
  <div id="nameHelp" class="form-text">
    Enter your full name as it appears on official documents.
  </div>
</div>
```
