# Agents — Master Data

Berbeda dari `skills/`, agent (subagent) **tidak punya format lintas-platform
tunggal** — tiap platform pakai frontmatter dan lokasi berbeda. Jadi satu
agent di sini = satu folder `agents/<nama-agent>/` berisi **satu file per
platform**, isi body (system prompt) sama, cuma frontmatter yang beda dialek.

```
agents/
  <nama-agent>/
    claude-code.md   # .claude/agents/<nama-agent>.md
    opencode.md       # .opencode/agents/<nama-agent>.md
    antigravity.md     # .agents/agents/<nama-agent>.md
    commandcode.md      # .commandcode/agents/<nama-agent>.md
    cursor.md             # .cursor/agents/<nama-agent>.md
    codex.toml             # .codex/agents/<nama-agent>.toml
```

Catatan: `codex.toml` **beda format** dari yang lain — bukan Markdown +
frontmatter YAML, tapi TOML murni dengan system prompt di field
`developer_instructions` (lihat contoh di `reviewer/codex.toml`). Isinya
tetap dijaga sama secara substansi dengan file platform lain, cuma
di-encode ke syntax TOML.

## Cara pakai

Salin file platform yang relevan ke lokasi yang platform itu baca (lihat
tabel di bawah), rename sesuai konvensi platform kalau perlu (mis. nama
file = nama agent untuk sebagian besar platform).

| Platform | Lokasi project | Lokasi global |
|---|---|---|
| Claude Code | `.claude/agents/<name>.md` | `~/.claude/agents/<name>.md` |
| OpenCode | `.opencode/agents/<name>.md` | (ikuti config opencode) |
| Antigravity | `.agents/agents/<name>.md` atau `.agents/agents/<name>/agent.md` | `~/.gemini/config/agents/<name>.md` |
| Command Code | `.commandcode/agents/<name>.md` | `~/.commandcode/agents/<name>.md` |
| Cursor | `.cursor/agents/<name>.md` | `~/.cursor/agents/<name>.md` |
| Codex CLI | `.codex/agents/<name>.toml` | `~/.codex/agents/<name>.toml` |

## Frontmatter per platform (ringkas)

| Platform | Field khas | Catatan |
|---|---|---|
| Claude Code | `tools`, `model` | `tools` daftar tool string dipisah koma |
| OpenCode V2 | `description`, `mode` (`primary`/`subagent`/`all`), `model` (opsional), `permissions` (daftar `action`/`resource`/`effect`) | body markdown = system prompt; nama agent berasal dari nama file |
| Antigravity | `tools` (array), `mainAgent`, `subagent`, `commandExecutionPolicy`, `skills` | `subagent: true` supaya bisa dipanggil `invoke_subagent` |
| Command Code | `tools`, `disallowedTools`, `permissionMode`, `maxTurns`, `background`, `showOutput` | nama `explore`/`plan`/`review`/`general` reserved, tidak bisa dioverride |
| Cursor | `model`, `readonly`, `is_background` | filename = identitas subagent |
| Codex CLI | `name`, `description`, `developer_instructions` (wajib); `model`, `model_reasoning_effort`, `sandbox_mode`, `mcp_servers`, `skills.config` (opsional) | TOML, bukan Markdown+YAML — `developer_instructions` = system prompt |

**Model OpenCode V2 untuk subagent.** File agent per-platform tidak sama —
tiap platform punya parser dan aturan model sendiri:

- **OpenCode V2**: jika subagent harus mengikuti model sesi/parent yang
  memanggilnya, **hilangkan field `model`**. Subagent tanpa `model`
  menggunakan model parent; bila `model` diisi, gunakan `provider/model`
  dan opsional `#variant`. Jangan gunakan `model: inherit`.
- **Claude Code**: `model: inherit` valid dan memang berarti "ikut model
  sesi".
- **Cursor/Command Code**: belum diverifikasi ulang terhadap dokumentasi
  resmi — kalau menambah agent baru untuk platform ini, cek dulu apakah
  `inherit` benar-benar didukung sebelum menyalin pola dari platform lain.

Pelajaran umumnya: jangan asumsikan sebuah nilai/field aman di semua
platform hanya karena aman di `SKILL.md` atau di satu platform lain — file
agent per-platform butuh diverifikasi satu-satu terhadap dokumentasi resmi
platform tersebut sebelum ditulis ke instalasi.

## Pola: agent mendelegasikan ke skill

Agent di sini sengaja ditulis **tipis** — orkestrasi + orientasi (cari diff,
cari spec), lalu mendelegasikan metodologi sesungguhnya ke skill terkait di
`../skills/`. Ini supaya metodologi (mis. lima-axis code review) tetap satu
sumber kebenaran (`skills/code-review-and-quality/SKILL.md`), bukan
diduplikasi ulang di lima file agent. Kalau perlu mengubah cara review
dilakukan, edit skill-nya — bukan lima file agent sekaligus.

## Override project-scoped

Sama seperti skill: kalau sebuah project punya konvensi reviewer sendiri
(format output JSON, checklist tambahan, dsb), buat salinan agent ini di
lokasi skill/agent project tersebut dengan nama yang sama, lebih spesifik
dari versi generik di sini. Lihat contoh nyata di
`../skills/prd-grill/references/project-override-example.md` untuk pola
yang sama diterapkan ke skill.
