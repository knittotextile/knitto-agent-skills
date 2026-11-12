---
name: migrate-to-react-ui
description: "Migrasi komponen UI lokal ke @knittotextile/react-ui di project berbasis knitto-react-template. Gunakan saat mengganti modal/toast/dropdown/table/select lokal atau elemen HTML native dengan komponen lib, update import, atau cleanup src/components/ui yang obsolete."
license: MIT
metadata:
  category: knitto-react
  author: lintang
  scope: project
compatible_with: [claude-code, opencode, cursor, codex, antigravity]
---

# Migrate to React UI

## Checklist migrasi

```
- [ ] Cek komponen tersedia di @knittotextile/react-ui versi package.json
- [ ] Ganti import dari @/components/ui/* ke @knittotextile/react-ui
- [ ] Sesuaikan API (compound components, props baru)
- [ ] Update test yang import komponen lokal
- [ ] Hapus folder lokal jika tidak ada import tersisa
- [ ] Update halaman example jika ada
- [ ] pnpm build && pnpm vitest run
```

## Mapping umum

| Lokal (legacy)                 | Lib                                           |
| ------------------------------ | --------------------------------------------- |
| `@/components/ui/modal`        | `Modal`, `useOverlayState`                    |
| `@/components/ui/toast`        | `useToast`, `toast.show()` via KnittoProvider |
| `@/components/ui/dropdown`     | `Dropdown` compound                           |
| `@/components/ui/radio`        | `Radio`, `RadioGroup`                         |
| `@/components/ui/knitto-table` | `KnittoTable`                                 |
| `@/components/ui/big-calendar` | `BigCalendar`                                 |
| `@/components/ui/button`       | `Button`                                      |
| Typography lokal               | `Typography`                                  |

## Modal

```tsx
// ❌ Lama
import Modal from '@/components/ui/modal';

// ✅ Baru
import { Modal, useOverlayState } from '@knittotextile/react-ui';
const modal = useOverlayState();
```

Hapus referensi `modal-open` di body — lib handle overflow sendiri.

## Toast

```tsx
// ✅
const toast = useToast();
toast.show({ variant: 'success', message: 'Berhasil disimpan' });
```

Tidak perlu `ToastProvider` terpisah — sudah di `KnittoProvider`.

## Styles

Pastikan `src/styles/main.css` import `@knittotextile/react-ui/styles`.

## Vite cache

Setelah update versi lib:

```bash
pnpm dev --force
```

Detail: [reference.md](reference.md)
