import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../src/components/template");
const dirs = ["invoice 3", "estimate 2", "invoice 2"];

const BLOCK_REGEX =
  /\/\* Per-template item layout[\s\S]*?(?=\n\s*<\/style>)/g;

let changed = 0;

for (const dir of dirs) {
  const folder = path.join(root, dir);
  if (!fs.existsSync(folder)) continue;
  for (const file of fs.readdirSync(folder)) {
    if (!file.endsWith(".html")) continue;
    const fp = path.join(folder, file);
    let content = fs.readFileSync(fp, "utf8");
    if (!BLOCK_REGEX.test(content)) continue;
    content = content.replace(BLOCK_REGEX, "");
    fs.writeFileSync(fp, content);
    changed++;
    console.log(`Stripped item CSS: ${dir}/${file}`);
  }
}

console.log("Total stripped:", changed);
