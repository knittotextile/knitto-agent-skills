# Referensi — Migrasi React UI

## Sudah dimigrasi di template

Button, Typography, Select, DatePicker, DateTimePicker, DateRangePicker, MonthYearPicker, Pagination, KnittoTable, BigCalendar, Modal, Dropdown, Radio, Toast, KnittoProvider, ThemeToggle

## Masih lokal (pertahankan)

- `src/components/ui/inputs/*` — Input, InputSearch, InputWithLabel, InputDebounce
- `src/components/ui/form/*` — FormWrapper, FeedbackErrorInput
- `src/components/ui/icon/*`
- `src/components/ui/card`, `container/*`, `portal`
- `src/components/layout/*`

## Folder legacy (kandidat hapus jika tidak diimport)

modal/, toast/, dropdown/, radio/, table/, checkbox/, shimmer/, empty/, label/, textarea/, knui/

Verifikasi sebelum hapus:

```bash
rg "@/components/ui/modal" src/
```

## Versi lib

Cek `package.json` → `"@knittotextile/react-ui": "^x.y.z"`

## main.tsx theme fix

```tsx
const initialTheme = readStoredTheme() ?? 'system';
<KnittoProvider defaultTheme={initialTheme} ...>
```

Mencegah theme preference di localStorage tertimpa saat reload.
