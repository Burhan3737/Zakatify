# Zakatify Theme System

## Overview

Zakatify uses a comprehensive theming system built on CSS Custom Properties (CSS Variables). The system supports 6 distinct Islamic-inspired themes, with both light and dark mode variants.

## Architecture

### How It Works

1. **Theme State**: Managed via React Context (`ThemeContext.jsx`)
2. **CSS Variables**: All colors, spacing, and theme-specific values use CSS custom properties
3. **Data Attribute**: The active theme is applied via `data-theme` attribute on the `<html>` element
4. **Persistence**: User preference is saved to `localStorage`
5. **Auto-Detection**: On first visit, the app detects system color scheme preference

### Theme Application

```html
<!-- HTML element gets data-theme attribute -->
<html data-theme="sahara">
```

## Available Themes

| Theme ID | Name | Icon | Mode | Color Palette |
|----------|------|------|------|---------------|
| `sahara` | Sahara | ☀️ | Light | Warm sand, sage green, golden accents |
| `mosque` | Mosque Green | 🕌 | Light | Ivory, deep forest green, rich gold |
| `marrakesh` | Marrakesh | 🏺 | Light | Sandy beige, teal, burnt orange |
| `night` | Night Mode | 🌙 | Dark | Deep indigo, vibrant teal, warm gold |
| `ramadan` | Ramadan Blue | ✨ | Dark | Deep plum, celestial blue, silver |
| `desertRose` | Desert Rose | 🌸 | Light | Dusty rose, deep coral, warm peach |

## Theme Details

### Sahara (Default)
A warm, inviting desert palette with sandy backgrounds and sage green accents. The golden accent creates a sense of warmth and hospitality, perfect for everyday use.

**Best for:** General use, welcoming interfaces

### Mosque Green
An elegant, formal palette inspired by traditional Islamic architecture. Deep forest greens paired with ivory and rich gold create a dignified, refined aesthetic.

**Best for:** Professional settings, formal applications

### Marrakesh
A vibrant, bazaar-inspired theme with earthy terracotta tones and bold teal accents. The burnt orange brings energy and warmth reminiscent of Moroccan markets.

**Best for:** Creative applications, energetic interfaces

### Night Mode
A rich dark theme with deep indigo backgrounds. The vibrant teal brand color pops against the dark background, with warm gold accents adding sophistication.

**Best for:** Low-light environments, evening use

### Ramadan Blue
A spiritual, ethereal dark theme inspired by the night sky during Ramadan. Deep plum backgrounds with celestial blue and silver create a serene, contemplative atmosphere.

**Best for:** Evening use, spiritual/religious applications

### Desert Rose
A soft, romantic palette with dusty rose backgrounds and warm coral accents. The gentle coloring creates a calming, nurturing feel.

**Best for:** Gentle, approachable interfaces

## Using Themes in New Components

### Basic Usage

Always use CSS variables instead of hardcoded colors:

```css
/* ✅ CORRECT - Use CSS variables */
.my-component {
  background: var(--surface);
  color: var(--ink);
  border: 1px solid var(--line);
}

/* ❌ INCORRECT - Hardcoded colors */
.my-component {
  background: #ffffff;
  color: #1f2c23;
  border: 1px solid #dde3d7;
}
```

### CSS Variable Reference

#### Core Colors

| Variable | Usage | Light Example | Dark Example |
|----------|-------|---------------|--------------|
| `--bg` | Page background | `#f5ede0` (warm sand) | `#0f1424` (deep indigo) |
| `--surface` | Card/panel backgrounds | `#fffdf8` (cream) | `#1a2236` (dark surface) |
| `--surface-elevated` | Elevated cards, modals | `#ffffff` | `#242d44` |
| `--ink` | Primary text | `#2c2618` (warm brown) | `#e8ecea` (soft white) |
| `--ink-secondary` | Secondary text | `#4a4232` | `#c5cbc6` |
| `--muted` | Muted/helper text | `#6b6052` | `#8a958a` |

#### Brand & Accent Colors

| Variable | Usage | Example |
|----------|-------|---------|
| `--brand` | Primary buttons, active states | `#0d8b68` (green) |
| `--brand-ink` | Brand text, links | `#0c5f49` |
| `--brand-hover` | Button hover states | `#0a7a5a` |
| `--brand-light` | Light brand tints | `#e8f6ef` |
| `--accent` | Gold highlights, special elements | `#d4b06a` |
| `--accent-light` | Light accent tints | `#f5ecd8` |

#### Status Colors

| Variable | Usage | Light | Dark |
|----------|-------|-------|------|
| `--above` | Above nisab status | `#14805f` | `#2dd4a0` |
| `--close` | Close to nisab | `#b97900` | `#fbbf24` |
| `--below` | Below nisab | `#a23529` | `#f87171` |

#### Borders & Lines

| Variable | Usage |
|----------|-------|
| `--line` | Standard borders | `#dde3d7` |
| `--line-subtle` | Subtle dividers | `#e8ede4` |
| `--line-strong` | Emphasized borders | `#c8d0c2` |

#### Interactive States

| Variable | Usage |
|----------|-------|
| `--focus-ring` | Focus outline color | `rgba(13, 139, 104, 0.4)` |
| `--hover-bg` | Hover background | `rgba(13, 139, 104, 0.05)` |
| `--active-bg` | Active/pressed background | `rgba(13, 139, 104, 0.1)` |

#### Shadows

| Variable | Usage |
|----------|-------|
| `--shadow-sm` | Small shadows (inputs) | `0 1px 2px rgba(0,0,0,0.05)` |
| `--shadow-md` | Medium shadows (cards) | `0 4px 16px rgba(23,36,28,0.06)` |
| `--shadow-lg` | Large shadows (modals) | `0 8px 32px rgba(23,36,28,0.12)` |
| `--shadow-color` | Shadow color reference | `rgba(23,36,28,0.08)` |

### Component Patterns

#### Card/Panel Pattern

```css
.card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-md);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.card:hover {
  box-shadow: var(--shadow-lg);
}
```

#### Button Pattern

```css
.button {
  background: var(--brand);
  color: white;
  border: 1px solid var(--brand);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-4);
  transition: background 0.2s ease, border-color 0.2s ease;
}

.button:hover {
  background: var(--brand-hover);
  border-color: var(--brand-hover);
}

.button:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
```

#### Input Pattern

```css
.input {
  background: var(--surface);
  color: var(--ink);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
}

.input:focus {
  outline: none;
  border-color: var(--brand);
  box-shadow: 0 0 0 3px var(--focus-ring);
}
```

### Spacing Variables

| Variable | Value | Usage |
|----------|-------|-------|
| `--space-1` | 0.25rem (4px) | Tight spacing |
| `--space-2` | 0.5rem (8px) | Small gaps |
| `--space-3` | 0.75rem (12px) | Standard padding |
| `--space-4` | 1rem (16px) | Card padding |
| `--space-5` | 1.25rem (20px) | Large gaps |
| `--space-6` | 1.5rem (24px) | Section spacing |
| `--space-8` | 2rem (32px) | Major sections |
| `--space-10` | 2.5rem (40px) | Hero spacing |
| `--space-12` | 3rem (48px) | Page sections |

### Border Radius Variables

| Variable | Value | Usage |
|----------|-------|-------|
| `--radius-sm` | 6px | Inputs, small elements |
| `--radius-md` | 10px | Buttons, badges |
| `--radius-lg` | 14px | Cards, panels |
| `--radius-xl` | 18px | Large cards, hero |
| `--radius-full` | 9999px | Pills, circles |

### Typography

| Variable | Usage |
|----------|-------|
| `--font-sans` | "Manrope", sans-serif (body) |
| `--font-serif` | "Fraunces", serif (headings) |
| `--text-xs` | 0.75rem (12px) |
| `--text-sm` | 0.875rem (14px) |
| `--text-base` | 1rem (16px) |
| `--text-lg` | 1.125rem (18px) |
| `--text-xl` | 1.25rem (20px) |
| `--text-2xl` | 1.5rem (24px) |
| `--text-3xl` | 2rem (32px) |
| `--text-4xl` | 2.5rem (40px) |

## JavaScript/TypeScript Integration

### Using the useTheme Hook

```jsx
import { useTheme } from "../contexts/ThemeContext";

function MyComponent() {
  const { currentTheme, setTheme, isDark, toggleDarkMode } = useTheme();

  return (
    <div>
      <p>Current theme: {currentTheme.name}</p>
      <button onClick={toggleDarkMode}>
        Toggle {isDark ? "Light" : "Dark"} Mode
      </button>
    </div>
  );
}
```

### Programmatic Theme Switching

```jsx
// Switch to specific theme
setTheme("mosque");

// Toggle between light/dark
setTheme(isDark ? "sahara" : "night");
```

## Adding a New Theme

To add a new theme:

1. **Add theme to `ThemeContext.jsx`**:

```javascript
export const THEMES = {
  // ... existing themes
  myNewTheme: {
    id: "myNewTheme",
    name: "My Theme",
    description: "Description of theme",
    icon: "🎨",
    isDark: false,
  },
};
```

2. **Add CSS variables in `style.css`**:

```css
[data-theme="myNewTheme"] {
  --bg: #your-color;
  --surface: #your-color;
  /* ... all required variables */
}
```

3. **Update `meta[name="theme-color"]` in `ThemeContext.jsx`**:

```javascript
const themeColors = {
  // ... existing themes
  myNewTheme: "#your-bg-color",
};
```

## Best Practices

1. **Always use CSS variables** for any theme-affected property
2. **Test all themes** when adding new components
3. **Ensure sufficient contrast** in all themes (WCAG AA minimum)
4. **Use smooth transitions** when changing themeable properties
5. **Respect reduced motion** preferences for theme transitions

## Accessibility

- All themes meet WCAG AA contrast requirements
- Focus states are visible in all themes
- Theme selector is keyboard accessible
- System preference is detected automatically

## Responsive Behavior

Themes automatically adapt to screen size. Responsive breakpoints:

- **Mobile**: < 480px (single column)
- **Tablet**: 480px - 768px (adjusted spacing)
- **Desktop**: 768px+ (full layout)
- **Large**: 1024px+ (max-width containers)

## Pattern Overlays

Subtle Islamic geometric patterns are available as CSS backgrounds:

```css
.pattern-overlay {
  background-image: var(--pattern-geometry);
  background-size: 200px;
  opacity: 0.03;
}
```
