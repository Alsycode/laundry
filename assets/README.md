# /assets

Live artwork used by the demo.

## clothing/
`<type>.png` for each clothing type: `shirt, tshirt, jeans, pants, saree, dress, bedsheet,
towel, jacket, shorts, skirt`. ~640px, product photo flattened on white, downscaled/optimised.
Rendered by `clothPic(type, cls)` in `script.js` with `object-fit:contain`. If a file is
missing the UI falls back to that type's emoji glyph.

## branding/
- `logo.png` — green folded-shirt + water-drop mark. Used on the invoice header
  (falls back to the text "FP").
- `hero-towels.png` — folded-towel stack. Used on the Order Created foot and the Delivered
  screen hero (falls back to a 🧺 emoji).

## icons/
Empty. App/nav icons are inline SVG in `script.js` (`icon()`), and the three service icons
(Wash / Iron / Wash + Iron) are still emoji — candidates for inline SVG later.

## To replace an image
Drop a new file with the same name/size and reload. Larger sources: re-run the PIL downscale
snippet noted in `BUILD_PROGRESS.md` (Session 2 log) to keep the repo light.
