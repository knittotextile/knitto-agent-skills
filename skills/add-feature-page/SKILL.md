---
name: add-feature-page
description: "Menambah halaman feature CRUD di project berbasis knitto-react-template (index.page, form.page, route, hooks, RTK Query) dengan struktur standar Knitto. Gunakan saat membuat modul/halaman baru di src/pages/ atau menambah list+form feature. Hanya untuk repo turunan knitto-react-template."
license: MIT
metadata:
  category: knitto-react
  author: lintang
  scope: project
compatible_with: [claude-code, opencode, cursor, codex, antigravity]
---

# Add Feature Page

Workflow menambah halaman feature dengan struktur standar Knitto.

## Checklist

```
- [ ] Buat folder src/pages/{modul}/{feature}/
- [ ] Buat redux/api/{feature}.ts + daftarkan di store.ts
- [ ] Buat hooks/use-{feature}.ts (+ use-{feature}-by-id.ts jika perlu)
- [ ] Buat index.page.tsx (list)
- [ ] Buat form.page.tsx (create/edit) + context jika form kompleks
- [ ] Buat route.tsx dengan loadable
- [ ] Daftarkan di modul index.tsx (sidebar + Routes, url dengan /*)
- [ ] Tambah MSW handler jika perlu test integration
```

## Langkah

### 1. RTK Query service

Buat `src/redux/api/{feature}.ts` — lihat `src/redux/api/auth.ts` sebagai referensi template. Daftarkan reducer + middleware di `store.ts`.

### 2. Page hook

```tsx
// hooks/use-{feature}.ts
import { useParams } from '@/lib/hooks/hooks';
import { useGetFeatureListQuery } from '@/redux/api/{feature}';

export default function useFeature() {
  const { page, perPage, setPage, setPerPage, onNextPrev, search, setSearch } = useParams();
  const { data, isLoading } = useGetFeatureListQuery({ page, perPage, q: search });
  return {
    isLoading,
    data: data?.result.data ?? [],
    pagination: data?.result.metadata,
    page,
    perPage,
    setPage,
    setPerPage,
    onNextPrev,
    search,
    setSearch,
  };
}
```

### 3. List page

- Import UI dari `@knittotextile/react-ui` (Typography, Pagination, KnittoTable)
- Logic hanya dari hook
- Layout: `<section className="px-4 py-5 bg-white h-full">`

### 4. Route

```tsx
import loadable from '@loadable/component';
import { Route, Routes } from 'react-router-dom';

const ListPage = loadable(() => import('./index.page'));
const FormPage = loadable(() => import('./form.page'));

export default function FeatureRoute() {
  return (
    <Routes>
      <Route path="/" element={<ListPage />} />
      <Route path="/:id/edit" element={<FormPage type="edit" />} />
    </Routes>
  );
}
```

### 5. Daftarkan di modul

Di `src/pages/{modul}/index.tsx`:

```tsx
const FeatureRoute = loadable(() => import('./{feature}/route'));
// sidebar: { label: 'Feature', url: '{modul}/{feature}/*', element: <FeatureRoute /> }
```

## Referensi

Detail contoh: [reference.md](reference.md)
