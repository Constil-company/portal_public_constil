import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  detectItemsLayout,
  getItemsLayoutCss,
} from "../src/components/template/template-item-layouts.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../src/components/template");
const dirs = ["invoice 3", "estimate 2"];

const ITEM_CSS_BLOCK_REGEX =
  /\/\* Per-template item layout[\s\S]*?content: 'TOTAL'; \}/g;

let changed = 0;

for (const dir of dirs) {
  const folder = path.join(root, dir);
  for (const file of fs.readdirSync(folder)) {
    if (!file.endsWith(".html")) continue;
    const fp = path.join(folder, file);
    let content = fs.readFileSync(fp, "utf8");
    const layout = detectItemsLayout(content);
    const css = getItemsLayoutCss(layout);
    if (!css) continue;

    const block = `/* Per-template item layout (${layout}) */${css}`;

    content = content.replace(ITEM_CSS_BLOCK_REGEX, "");
    if (!content.includes("Per-template item layout") && content.includes("</style>")) {
      content = content.replace("</style>", `\n    ${block.trim()}\n    </style>`);
    }

    fs.writeFileSync(fp, content);
    changed++;
    console.log(`Fixed ${dir}/${file} → ${layout}`);
  }
}

console.log("Total fixed:", changed);
