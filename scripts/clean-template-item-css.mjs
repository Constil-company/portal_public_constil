import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../src/components/template");
const dirs = ["invoice 3", "estimate 2"];

let changed = 0;

for (const dir of dirs) {
  const folder = path.join(root, dir);
  for (const file of fs.readdirSync(folder)) {
    if (!file.endsWith(".html")) continue;
    const fp = path.join(folder, file);
    let content = fs.readFileSync(fp, "utf8");
    const original = content;

    content = content.replace(
      /\n\s*\/\*(?:\s*STACKED|\s*PERFECT|\s*--- TABLE)[\s\S]*?(?=\n\s*<\/style>)/g,
      "\n        /* Item table layout: constil-template-compact */\n"
    );

    content = content.replace(
      /\n\s*\.items-9-list-area[\s\S]*?(?=\n\s*\.(?!items)|\n\s*<\/style>|\n\s*<\/head>|\n\s*<body)/g,
      ""
    );
    content = content.replace(
      /\n\s*\.items-area-box-2[\s\S]*?(?=\n\s*\.(?!items)|\n\s*<\/style>|\n\s*<\/head>|\n\s*<body)/g,
      ""
    );
    content = content.replace(
      /\n\s*\.items-area\s*>[\s\S]*?(?=\n\s*\.(?!items-area)|\n\s*<\/style>|\n\s*<\/head>|\n\s*<body)/g,
      ""
    );

    if (content !== original) {
      fs.writeFileSync(fp, content);
      changed++;
      console.log("Updated", `${dir}/${file}`);
    }
  }
}

console.log("Total files updated:", changed);
