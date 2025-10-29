# 🌟 Shimmer Loader System Documentation

## Overview

The shimmer loader system provides non-intrusive CSS-only loading skeletons for your application. It uses neutral gray gradients with smooth 2-second animations and fades out gracefully when data loads.

**Key Features:**
- ✅ CSS-only (no heavy JavaScript)
- ✅ Non-intrusive (doesn't affect existing functionality)
- ✅ Smooth animations and transitions
- ✅ Reusable classes for any component
- ✅ 600ms fade-out animation
- ✅ Accessibility-friendly (respects `prefers-reduced-motion`)

---

## Quick Start

### HTML Usage

#### Basic Text Shimmer
```html
<!-- During loading -->
<div class="shimmer-text"></div>

<!-- After loading (fade out) -->
<p>Actual content here</p>
```

#### Table Skeleton
```html
<!-- While loading -->
<table class="shimmer-table">
    <thead>
        <tr>
            <th><div class="shimmer-text"></div></th>
            <th><div class="shimmer-text"></div></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><div class="shimmer-text"></div></td>
            <td><div class="shimmer-text"></div></td>
        </tr>
    </tbody>
</table>

<!-- After loading (actual table) -->
<table>
    <!-- actual content -->
</table>
```

### JavaScript Usage

```javascript
import { shimmerLoader } from '/js/utils/shimmerLoader.js';

// Show shimmer on element
shimmerLoader.show('#table-container');

// Hide shimmer with fade-out animation
shimmerLoader.hide('#table-container');

// Toggle shimmer on/off
shimmerLoader.toggle('#table-container');

// Hide all active shimmers
shimmerLoader.hideAll();

// Manage skeleton state
shimmerLoader.setSkeleton('#content', true);   // Show loading
shimmerLoader.setSkeleton('#content', false);  // Show loaded
```

---

## Available Classes

### Text Shimmers
```html
<!-- Full-width text (16px height) -->
<div class="shimmer-text"></div>

<!-- Different widths -->
<div class="shimmer-text shimmer-text-long"></div>    <!-- 90% width -->
<div class="shimmer-text shimmer-text-medium"></div>  <!-- 70% width -->
<div class="shimmer-text shimmer-text-short"></div>   <!-- 40% width -->

<!-- Small rounded text (12px height) - for labels/metadata -->
<div class="shimmer-text-sm"></div>

<!-- Single line (10px height) -->
<div class="shimmer-line"></div>
```

### Card Shimmer
```html
<div class="shimmer-card">
    <div class="shimmer-card-header">
        <div class="shimmer-card-avatar"></div>
        <div class="shimmer-card-title">
            <div class="shimmer-text"></div>
            <div class="shimmer-text-sm"></div>
        </div>
    </div>
    <div class="shimmer-card-content">
        <div class="shimmer-text"></div>
        <div class="shimmer-text"></div>
    </div>
</div>
```

### Table Shimmer
```html
<!-- Full table skeleton -->
<table class="shimmer-table">
    <thead>
        <tr>
            <th><div class="shimmer-text"></div></th>
            <th><div class="shimmer-text"></div></th>
            <th><div class="shimmer-text shimmer-text-short"></div></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><div class="shimmer-text"></div></td>
            <td><div class="shimmer-text"></div></td>
            <td><div class="shimmer-text shimmer-text-short"></div></td>
        </tr>
        <!-- More rows... -->
    </tbody>
</table>

<!-- Individual row shimmer -->
<tr class="shimmer-table-row">
    <td><div class="shimmer-text"></div></td>
    <td><div class="shimmer-text"></div></td>
</tr>
```

### List Item Shimmer
```html
<div class="shimmer-list-item">
    <div class="shimmer-list-avatar"></div>
    <div class="shimmer-list-content">
        <div class="shimmer-text"></div>
        <div class="shimmer-text-sm"></div>
    </div>
    <div class="shimmer-list-action"></div>
</div>
```

### Other Components
```html
<!-- Heading -->
<div class="shimmer-heading"></div>

<!-- Subheading -->
<div class="shimmer-subheading"></div>

<!-- Image/Media (16:9 aspect ratio) -->
<div class="shimmer-image"></div>

<!-- Button -->
<div class="shimmer-button"></div>

<!-- Badge -->
<div class="shimmer-badge"></div>

<!-- Paragraph (multiple lines) -->
<div class="shimmer-paragraph">
    <div class="shimmer-text"></div>
    <div class="shimmer-text"></div>
    <div class="shimmer-text shimmer-text-short"></div>
</div>

<!-- Form Field -->
<div class="shimmer-form-field">
    <div class="shimmer-label"></div>
    <div class="shimmer-input"></div>
</div>

<!-- Stats Card -->
<div class="shimmer-stats-card">
    <div class="shimmer-stats-label"></div>
    <div class="shimmer-stats-value"></div>
</div>
```

---

## Animation Specifications

- **Duration**: 2 seconds per cycle
- **Color**: Neutral gray gradient (#f0f0f0 → #e0e0e0 → #f0f0f0)
- **Fade-out**: 600ms smooth transition when data loads
- **Easing**: ease-out for fade-out animation

---

## Implementation Examples

### Example 1: Member List with Shimmer

```html
<!-- Skeleton during loading -->
<div id="member-list-skeleton">
    <div class="shimmer-list-item"></div>
    <div class="shimmer-list-item"></div>
    <div class="shimmer-list-item"></div>
</div>

<!-- Actual content (hidden initially) -->
<div id="member-list" style="display: none;">
    <!-- Actual member items -->
</div>
```

```javascript
import { shimmerLoader } from '/js/utils/shimmerLoader.js';

// Show shimmer while loading
shimmerLoader.show('#member-list-skeleton');

// When data is ready
setTimeout(() => {
    document.getElementById('member-list-skeleton').style.display = 'none';
    document.getElementById('member-list').style.display = 'block';
    shimmerLoader.hide('#member-list-skeleton');
}, 2000);
```

### Example 2: Table with Shimmer

```html
<!-- Show this during loading -->
<table class="shimmer-table" id="loading-table">
    <!-- shimmer rows -->
</table>

<!-- Show this when ready -->
<table id="data-table" style="display: none;">
    <!-- actual data -->
</table>
```

```javascript
// When data is loaded
fetch('/api/data')
    .then(response => response.json())
    .then(data => {
        // Hide shimmer
        shimmerLoader.hide('#loading-table');
        
        // Show actual data
        document.getElementById('loading-table').style.display = 'none';
        document.getElementById('data-table').style.display = 'table';
    });
```

### Example 3: Using setSkeleton for State Management

```html
<div id="content" class="is-loading shimmer-skeleton">
    <!-- Skeleton content here -->
</div>
```

```javascript
// Initially is-loading class is applied
// When data loads:
shimmerLoader.setSkeleton('#content', false);
// This adds is-loaded, triggers fade-out, then cleans up
```

---

## Accessibility

The shimmer loader system respects user preferences:

```css
@media (prefers-reduced-motion: reduce) {
    .shimmer,
    .shimmer-skeleton {
        animation: none;
        background-color: #f0f0f0;  /* Static gray background */
    }
}
```

Users with reduced motion preferences will see a static placeholder instead of animated shimmer.

---

## Best Practices

1. **Start with shimmer on page load**
   - Show skeleton before data fetches
   - Smooth user experience

2. **Fade out gracefully**
   - Use `shimmerLoader.hide()` for 600ms fade-out
   - Don't abruptly remove shimmers

3. **Match component structure**
   - Make skeleton match actual component layout
   - Same widths, heights, spacing

4. **Use semantic classes**
   - `.shimmer-text` for text content
   - `.shimmer-table` for tables
   - `.shimmer-card` for cards, etc.

5. **Hide all when done**
   - Use `shimmerLoader.hideAll()` to clean up multiple shimmers

---

## Troubleshooting

### Shimmer not showing?
- Verify element has correct class (`shimmer`, `shimmer-text`, etc.)
- Check CSS is imported in `styles.scss`
- Ensure element is visible in DOM

### Fade-out not smooth?
- Default duration is 600ms (matches CSS animation)
- Can pass custom duration: `shimmerLoader.hide(selector, 800)`

### Animation too fast/slow?
- Edit `@keyframes shimmer` in `_shimmer.scss`
- Change `2s` to desired duration (e.g., `1.5s`, `2.5s`)

---

## Files

- **Styles**: `/src/scss/_shimmer.scss`
- **Utilities**: `/src/js/utils/shimmerLoader.js`
- **Import**: Included in `/src/scss/styles.scss`

---

**Ready to use! No additional setup needed.** ✨
