import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  detectItemsLayout,
  getItemsLayoutCss,
} from "../src/components/template/template-item-layouts.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../src/components/template");
const dirs = ["invoice 3", "estimate 2", "invoice 2"];

let changed = 0;

for (const dir of dirs) {
  const folder = path.join(root, dir);
  for (const file of fs.readdirSync(folder)) {
    if (!file.endsWith(".html")) continue;
    const fp = path.join(folder, file);
    const content = fs.readFileSync(fp, "utf8");
    const layout = detectItemsLayout(content);
    const css = getItemsLayoutCss(layout);
    if (!css) continue;

    const marker = "/* Item table layout: constil-template-compact */";
    const replacement = `/* Per-template item layout (${layout}) */${css}`;

    let next = content;
    if (content.includes(marker)) {
      next = content.replace(marker, replacement);
    } else if (content.includes("</style>")) {
      next = content.replace("</style>", `${replacement}\n    </style>`);
    } else {
      continue;
    }

    if (next !== content) {
      fs.writeFileSync(fp, next);
      changed++;
      console.log(`Restored ${dir}/${file} → ${layout}`);
    }
  }
}

console.log("Total restored:", changed);
