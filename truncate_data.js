import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, 'public');
const FILES = [
    'vajra_customers.json',
    'vajra_orders.json',
    'vajra_order_items.json',
    'vajra_products.json',
    'vajra_order_returns.json'
];

const LIMIT = 2000;

async function truncateFiles() {
    console.log(`Starting truncation (Limit: ${LIMIT} records)...`);

    for (const file of FILES) {
        try {
            const filePath = path.join(PUBLIC_DIR, file);
            const smallFilePath = path.join(PUBLIC_DIR, file.replace('.json', '_small.json'));

            console.log(`Reading ${file}...`);
            const content = await fs.readFile(filePath, 'utf-8');
            const json = JSON.parse(content);

            if (Array.isArray(json)) {
                const limited = json.slice(0, LIMIT);
                await fs.writeFile(smallFilePath, JSON.stringify(limited, null, 2));
                console.log(`✓ Created ${path.basename(smallFilePath)} (${limited.length} items)`);
            } else {
                console.log(`⚠ ${file} is not an array, skipping.`);
            }
        } catch (err) {
            console.error(`❌ Error processing ${file}:`, err.message);
        }
    }
    console.log('Done!');
}

truncateFiles();
