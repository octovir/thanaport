# FLUID — an experiment by Thanakrit

An interactive white-and-blue material study built with React, Vite, and Three.js. A continuous scroll scene leads into a full-screen sculpture gallery and a quiet contact invitation.

## Run locally

```sh
npm install
npm run dev
```

## Verify

```sh
npm run lint
npm run build
npm test
```

Browser tests use locally installed Google Chrome (`channel: 'chrome'`). They cover scroll chapters, material controls, rendered material changes, keyboard rotation, WebGL restoration, narrow and landscape screens, collapsed controls and focus restoration, navigation, and contact feedback. Contact requests are intercepted; tests never send real messages. Mail delivery depends on the existing Web3Forms account configuration.

## The experience

- Scroll changes the glass geometry, rotation, orbiting droplets, and typography. Native scrolling remains intact; chapter buttons and navigation can skip ahead.
- Drag the sculpture with a mouse or focus it and use arrow keys to rotate. Touch scrolling stays native.
- The Material button opens an on-demand control panel; Escape or an outside click closes it. Pause remains available in the compact dock. Water, Frost, and Chrome presets change the rendered material. Distortion changes the surface; Dispersion separates refracted color channels. Pause stops ambient motion while allowing deliberate interaction.
- Visible hero typography is native SVG text, independent of the GPU pixel budget. The glass shader refracts a separate raster copy of the same typography. The gallery pairs three real repositories with physical glass sculptures, moving across the viewport with native scrolling. The closing invitation opens an accessible contact dialog.
- Reduced motion removes ambient animation and smoothing. Short screens use normal document flow; WebGL failure leaves a static illustration. Rendering stops offscreen, and a restored context resumes the scene.

## Editing

- `src/components/Experience.jsx`: chapter copy, scroll mapping, material controls.
- `src/components/GlassScene.jsx`: rendering, input, responsive typography textures, GPU lifecycle.
- `src/lib/glassShaders.js`: animated geometry and refraction shaders.
- `src/components/GalleryScene.jsx`: glass sculptures, lighting, rendering lifecycle.
- `src/components/SelectedWork.jsx`: real repositories, pinned gallery and project navigation.
- `src/components/ContactSection.jsx`: contact details and existing Web3Forms integration.
- `src/pages/Home.jsx`: composition and legacy route handling.
- `src/index.css`, `src/exhibition.css` and `src/portfolioDetails.css`: responsive styling.
- `public/CV_Thanakrit_Rattanaumnuaysiri.pdf`: existing CV.

`/home` opens the experience, `/contact` scrolls to contact, and `/github` scrolls to work. Static hosting must serve `index.html` for those legacy routes. Google Fonts has system-font fallbacks; the 3D scene requires no remote model or environment map. Three.js loads in a separate chunk. Both scenes match display density up to 3× within a 3.5-million-pixel budget; typography textures use the same resolution. The hero keeps a closed, non-self-intersecting ring surface throughout its morph, and gallery rings occupy separate concentric shells.

## Mobile rendering checks

`npm test` includes 3× display-density checks before and after rotation, plus a GPU transform-feedback check of the actual hero shader for seam closure and inward surface folding.

For WebKit: `npx playwright install webkit`, then `npx playwright test --config playwright.webkit.config.js`. This requires a compatible host WebKit runtime; the local runtime crashed before page creation during the latest check, so physical iPhone/Safari validation is still outstanding.
