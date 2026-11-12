# Referensi — Example Komponen

## Pola halaman modal (template)

File: `src/pages/example/components/modal/index.tsx`

- `useOverlayState()` dari lib untuk open/close
- Compound component: `Modal.Backdrop`, `Modal.Container`, `Modal.Dialog`, `Modal.Header`, `Modal.Body`, `Modal.Footer`
- Local helper `Card` di file yang sama untuk wrapper demo

## Pola halaman dropdown (template)

File: `src/pages/example/components/dropdown/index.tsx`

- Compound: `Dropdown.Trigger`, `Dropdown.Popover`, `Dropdown.Menu`, `Dropdown.Item`
- Prop `placement`: `bottom`, `bottom-end`, `top`, `top-end`
- `onAction` di `Dropdown.Menu` untuk handle klik item

## Sidebar config

File: `src/pages/example/index.tsx` — array `sidebarAdmin` dengan module **Komponen**.

Setiap item butuh:

- `label` — teks sidebar
- `url` — path relatif tanpa `/example/` prefix
- `element` — JSX loadable component

## Demo dengan kode

Halaman table/button memakai:

- `@/components/content-example-code`
- `@/components/toggle-show-code`

Untuk demo kompleks, pertimbangkan pola ini alih-alih inline Card sederhana.
