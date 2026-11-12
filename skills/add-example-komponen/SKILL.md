---
name: add-example-komponen
description: "Menambah halaman demo komponen @knittotextile/react-ui di area /example/komponen knitto-react-template. Gunakan saat menambah showcase komponen lib atau dokumentasi interaktif komponen UI; tidak relevan untuk repo turunan tanpa area example."
license: MIT
metadata:
  category: knitto-react
  author: lintang
  scope: project
compatible_with: [claude-code, opencode, cursor, codex, antigravity]
---

# Add Example Komponen

Menambah halaman demo komponen lib di area Example template.

## Checklist

```
- [ ] Buat src/pages/example/components/{nama-komponen}/index.tsx
- [ ] Tambah loadable import di src/pages/example/index.tsx
- [ ] Tambah entry sidebar module "Komponen"
- [ ] (Opsional) Buat subfolder cards/ atau sections/ jika demo banyak
- [ ] (Opsional) Integration test smoke di src/test/integrations/
```

## Template halaman

```tsx
import { Button, Typography } from '@knittotextile/react-ui';

export default function KomponenPage() {
  return (
    <div className="p-4 flex flex-col gap-3 mb-10">
      <Typography as="h3">Nama Komponen</Typography>
      <div className="h-2 w-72 bg-burnt-orange-100" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{/* demo cards */}</div>
    </div>
  );
}
```

## Daftarkan route

Di `src/pages/example/index.tsx`:

```tsx
const KomponenPage = loadable(() => import('./components/{nama-komponen}'));

// sidebar Komponen:
{ label: 'Nama', url: 'komponen/{nama-komponen}', element: <KomponenPage /> }
```

URL akhir: `/example/komponen/{nama-komponen}`

## Referensi existing

| Halaman  | Path                                              |
| -------- | ------------------------------------------------- |
| Modal    | `src/pages/example/components/modal/index.tsx`    |
| Dropdown | `src/pages/example/components/dropdown/index.tsx` |
| Toast    | `src/pages/example/components/toast/index.tsx`    |
| Button   | `src/pages/example/components/button/index.tsx`   |

Detail: [reference.md](reference.md)
