import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import your server app
const serverPath = resolve(__dirname, '../server/index.ts');
const { app } = await import(serverPath);

export default app;