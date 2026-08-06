---
name: nama-skill-contoh
description: Ganti dengan deskripsi jelas apa yang dilakukan skill ini dan KAPAN agent harus memakainya (dan kapan tidak). Ini yang dibaca agent untuk memutuskan trigger, jadi tulis spesifik, bukan generik.
license: MIT
compatibility: "Membutuhkan akses shell dan tool X"
metadata:
  category: contoh-kategori
  author: lintang
  version: "1.0.0"
allowed-tools: []
disallowed-tools: []
argument-hint: "<opsional argumen>"
when_to_use: "Konteks tambahan opsional untuk auto-invocation"
disable-model-invocation: false
user-invocable: true
model: inherit
effort: medium
compatible_with: [claude-code]
---

# Nama Skill Contoh

Satu paragraf: apa yang dilakukan skill ini dan hasil akhirnya apa.

## Kapan dipakai

- Trigger kondisi 1
- Trigger kondisi 2

## Kapan TIDAK dipakai

- Kondisi yang membuat skill ini tidak relevan

## Langkah-langkah

1. Langkah pertama
2. Langkah kedua
3. Langkah ketiga — kalau detailnya panjang, pindahkan ke `references/detail.md`
   dan cukup tunjuk dari sini.

## Referensi

- `references/` — dokumentasi/skema detail yang di-load on-demand
- `scripts/` — kode executable yang dipanggil skill ini
- `assets/` — template atau contoh output
