# Referensi — Feature Page

## Contoh struktur folder

```
src/pages/{modul}/{feature}/
├── index.page.tsx
├── form.page.tsx
├── route.tsx
├── hooks/
│   ├── use-{feature}.ts
│   └── use-{feature}-by-id.ts
├── components/
│   ├── table-{feature}.tsx
│   └── fixed-header.tsx
└── context/
    ├── {feature}-context.tsx
    └── {feature}-form-schema.ts
```

## index.page.tsx

```tsx
import { Pagination, Typography } from '@knittotextile/react-ui';
import TableFeature from './components/table-{feature}';
import useFeature from './hooks/use-{feature}';

export default function FeaturePage() {
  const { data, page, perPage, setPage, setPerPage, onNextPrev, pagination, isLoading } = useFeature();
  return (
    <section className="px-4 py-5 bg-white h-full">
      <Typography as="global-strong">List Feature</Typography>
      <TableFeature isLoading={isLoading} data={data} />
      <div className="flex justify-end mt-4">
        <Pagination
          page={page}
          onApplyPage={setPage}
          onApplyPerPage={setPerPage}
          perPage={perPage}
          totalData={pagination?.totalData || 0}
          onNext={onNextPrev}
          onPrev={onNextPrev}
        />
      </div>
    </section>
  );
}
```

## RTK Query

Template memakai `createApi` per file — ikuti `src/redux/api/auth.ts`.

## Sidebar modul

```tsx
{ label: 'Feature', url: '{modul}/{feature}/*', element: <FeatureRoute /> }
```

Suffix `/*` wajib untuk nested route di dalam `route.tsx`.
