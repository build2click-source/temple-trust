---
name: Vedic Radiance
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#554336'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#887364'
  outline-variant: '#dbc2b0'
  surface-tint: '#8f4e00'
  primary: '#8f4e00'
  on-primary: '#ffffff'
  primary-container: '#ff9933'
  on-primary-container: '#693800'
  inverse-primary: '#ffb77a'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed65b'
  on-secondary-container: '#745c00'
  tertiary: '#5d5f5f'
  on-tertiary: '#ffffff'
  tertiary-container: '#b1b2b2'
  on-tertiary-container: '#434545'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcc2'
  primary-fixed-dim: '#ffb77a'
  on-primary-fixed: '#2e1500'
  on-primary-fixed-variant: '#6d3a00'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  data-tabular:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 80px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The design system is anchored in the concept of "Sacred Geometry and Divine Light." It targets a sophisticated audience—devotees, donors, and scholars—who seek a balance between ancient tradition and modern professionalism. The UI must feel ethereal yet grounded, achieved through an expansive use of Alabaster white to simulate an open, sun-drenched temple courtyard.

The aesthetic leans heavily into **Minimalism** with a **High-Contrast** editorial edge. By prioritizing vast whitespace and sharp, architectural lines, the system evokes a sense of purity and clarity. Visual interest is maintained through high-key architectural photography and rhythmic, saffron-colored line art that mimics the flow of sacred chants or river currents.

## Colors

The palette is a symbolic representation of the divine. **Alabaster White (#FAFAFA)** serves as the canvas, representing clarity and the "divine light." **Warm Saffron (#FF9933)** is used purposefully for primary actions and energetic accents, while **Metallic Gold (#D4AF37)** provides a sense of prestige and history, reserved for ornamentation and secondary highlights.

For text, a deep neutral is employed to ensure accessibility against the light backgrounds. Saffron should be used sparingly for interactive elements to maintain its spiritual significance, rather than over-saturating the interface.

## Typography

This design system utilizes a dual-font strategy to bridge the gap between heritage and utility. 

**Noto Serif** (standing in for Cinzel) provides a stately, authoritative presence for headings. It should be used for titles, quotes, and section headers to imbue the content with a sense of timelessness. 

**Work Sans** (standing in for Outfit) is the workhorse for data, body copy, and labels. Its clean, geometric construction ensures that complex information regarding temple schedules, donations, or trust data remains highly legible and modern. Use All-Caps styling for labels to reinforce the architectural, "engraved" look of the brand.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model to mirror the stability of temple architecture. A 12-column grid is used for desktop views, with generous margins to allow the content to "breathe" within the "divine light."

Spacing is governed by an 8px rhythmic scale. Use "XXL" spacing (80px+) between major sections to emphasize the minimalist, high-end feel. Content should be centered or aligned to strong vertical axes, avoiding cluttered or asymmetrical compositions that might disrupt the sense of serenity.

## Elevation & Depth

To maintain a "clean and professional" look, this design system rejects heavy shadows. Depth is instead conveyed through **Low-Contrast Outlines** and **Tonal Layering**. 

1. **Surface Tiers:** Use subtle shifts between Alabaster (#FAFAFA) and pure White (#FFFFFF) to define different content areas.
2. **Gold Accents:** Use thin (1px) Metallic Gold borders to highlight featured content or primary cards.
3. **Photography Overlays:** High-key temple photography should be treated with light transparency or "Screen" blend modes to integrate seamlessly into the white backgrounds, creating a sense of atmospheric depth without visual weight.

## Shapes

The shape language is strictly **Sharp (0px radius)**. Every button, input field, card, and image container must feature hard 90-degree corners. This decision reinforces the architectural nature of the temple trust, suggesting strength, permanence, and precision. Wavy line-art patterns provide the only organic contrast to these rigid structural elements, symbolizing the fluidity of spirit within the structure of the temple.

## Components

### Buttons
Primary buttons are solid Warm Saffron with white text, featuring sharp corners. Secondary buttons use a 1px Metallic Gold border with Noto Serif text. All buttons should have a generous horizontal padding (min 32px) to maintain a premium feel.

### Cards
Cards are defined by a 1px border in a very light grey or Metallic Gold. No drop shadows. Use the saffron wavy line-art as a subtle background pattern for featured cards to distinguish them from standard informational blocks.

### Input Fields
Inputs are minimalist, consisting of a bottom-only border (1px) that turns Saffron on focus. Labels should use the `label-caps` typography style, positioned above the field.

### Photography & Visuals
Images must be "high-key"—bright, overexposed in a controlled manner, and clean. Avoid dark, moody shadows. When used as overlays, images should bleed to the edge of their containers to emphasize the sharp corner geometry.

### Additional Elements
- **Divider Lines:** Use 1px Metallic Gold lines to separate major sections.
- **Progress Bars:** Use for donation goals, styled as a simple Saffron fill within an Alabaster track.