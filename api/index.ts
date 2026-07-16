// api/index.ts
// Entry point untuk Vercel Serverless Function
// PENTING: Gunakan ekstensi .js (bukan tanpa ekstensi)
// karena package.json menggunakan "type": "module" (ES Modules)
// Node.js ESM tidak mendukung directory import — harus eksplisit ke file-nya.

import app from "../server.js";

export default app;