# Referensi — Browser Test

## renderWithProviders

File: `src/test/test-utils.tsx`

```tsx
<KnittoProvider defaultTheme="light">
  <Provider store={store}>
    <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
  </Provider>
</KnittoProvider>
```

## login.spec.tsx

- Mock `useNavigate`
- MSW untuk endpoint auth
- `userEvent.setup()` + `type` + `click`
- Assert dengan `expect.element(...).toHaveTextContent(...)`

## modal.spec.tsx

- Test halaman/modal yang pakai lib `Modal` + `useOverlayState`
- Bukan modal lokal `@/components/ui/modal`

## Vitest config

File: `vite.config.ts` — `test.browser.enabled: true`, setup `src/test/setup.ts`.

## Playwright

```bash
pnpm exec playwright install chromium
```
