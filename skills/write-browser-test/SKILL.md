---
name: write-browser-test
description: "Menulis test Vitest browser mode dengan renderWithProviders dan MSW di project berbasis knitto-react-template. Gunakan saat menambah integration test halaman, unit test hooks/slice, atau test komponen yang memakai @knittotextile/react-ui."
license: MIT
metadata:
  category: knitto-react
  author: lintang
  scope: project
compatible_with: [claude-code, opencode, cursor, codex, antigravity]
---

# Write Browser Test

## Pilih lokasi

| Jenis              | Lokasi                                  | Contoh                 |
| ------------------ | --------------------------------------- | ---------------------- |
| Integration page   | `src/test/integrations/{nama}.spec.tsx` | login.spec.tsx         |
| Unit logic/hook    | `src/test/units/{nama}.test.ts`         | hooks.test.ts          |
| Schema/helper page | `src/pages/{page}/{nama}.test.tsx`      | login.test.tsx         |
| Template component | `src/test/templates/{nama}.spec.tsx`    | action-toggle.spec.tsx |

## Integration test template

```tsx
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { userEvent } from 'vitest/browser';
import FeaturePage from '@/pages/feature';

describe('Feature Integration', () => {
  it('seharusnya merender halaman', async () => {
    const screen = await renderWithProviders(<FeaturePage />);
    await expect.element(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('seharusnya submit form', async () => {
    const screen = await renderWithProviders(<FeaturePage />);
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholder('Username'), 'admin');
    await screen.getByRole('button', { name: 'LOGIN' }).click();
    await expect.element(screen.getByText('Berhasil')).toBeInTheDocument();
  });
});
```

## Mock navigate

```tsx
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});
beforeEach(() => mockNavigate.mockClear());
```

## MSW handler

Tambah di `src/test/mocks/handlers/` lalu import di `handlers/index.ts`.

```tsx
http.get(`${env.VITE_BASE_API_URL}/auth/me`, () => HttpResponse.json({ result: { id: 1 } }));
```

## Don't

- Test komponen `@knittotextile/react-ui` secara isolasi
- Skip `await` pada `renderWithProviders` dan `expect.element`

Panduan: `src/test/README.md` · Contoh: [reference.md](reference.md)
