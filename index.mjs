#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { homedir } from "os";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BUNDLED_SKILL = join(__dirname, "SKILL.md");
const SKILL_DIR = join(homedir(), ".cursor", "skills", "procore-prototype");
const SKILL_FILE = join(SKILL_DIR, "SKILL.md");

const isTTY = process.stdout.isTTY;
const BOLD = isTTY ? "\x1b[1m" : "";
const DIM = isTTY ? "\x1b[2m" : "";
const ORANGE = isTTY ? "\x1b[38;5;202m" : "";
const GREEN = isTTY ? "\x1b[32m" : "";
const RED = isTTY ? "\x1b[31m" : "";
const WHITE = isTTY ? "\x1b[97m" : "";
const RESET = isTTY ? "\x1b[0m" : "";

const ok = (msg) => console.log(`  ${GREEN}✓${RESET} ${msg}`);
const warn = (msg) => console.log(`  ${RED}✗${RESET} ${msg}`);
const info = (msg) => console.log(`  ${DIM}${msg}${RESET}`);

const LOGO = `
${ORANGE}    ╱╲${RESET}
${ORANGE}   ╱  ╲${RESET}     ${WHITE}${BOLD}Procore Prototype Kit${RESET}
${ORANGE}  ╱ ╱╲ ╲${RESET}    ${DIM}Describe it. Prototype it.${RESET}
${ORANGE}  ╲ ╲╱ ╱${RESET}
${ORANGE}   ╲  ╱${RESET}
${ORANGE}    ╲╱${RESET}
`;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

console.log(LOGO);

const isUpdate = existsSync(SKILL_FILE);

const cursorPaths = [
  "/Applications/Cursor.app",
  join(homedir(), "AppData", "Local", "Programs", "Cursor", "Cursor.exe"),
  join(homedir(), ".local", "share", "cursor"),
];
const cursorFound =
  cursorPaths.some((p) => existsSync(p)) ||
  process.env.PATH?.includes("cursor");

if (!cursorFound) {
  warn("Cursor not found");
  info("Download from https://cursor.com (it's free)");
  process.exit(1);
}

try {
  mkdirSync(SKILL_DIR, { recursive: true });
  const content = readFileSync(BUNDLED_SKILL, "utf-8");
  writeFileSync(SKILL_FILE, content, "utf-8");
} catch (err) {
  warn("Could not install the skill file");
  info(err.message);
  process.exit(1);
}

const frames = ["◐", "◓", "◑", "◒"];
for (let i = 0; i < 8; i++) {
  process.stdout.write(`\r  ${ORANGE}${frames[i % 4]}${RESET} ${DIM}Installing skill...${RESET}`);
  await sleep(120);
}
process.stdout.write(`\r  ${GREEN}✓${RESET} Skill installed          \n`);

if (isUpdate) {
  console.log(`\n  ${GREEN}${BOLD}You're on the latest version.${RESET}\n`);
} else {
  console.log(`\n  ${GREEN}${BOLD}Ready to go!${RESET}\n`);
  console.log(`  ${BOLD}Verify it worked:${RESET}`);
  console.log(`    Open Cursor ${DIM}>${RESET} Settings ${DIM}>${RESET} Rules`);
  console.log(`    Look for ${BOLD}"procore-prototype"${RESET} under User Rules.\n`);
  console.log(`  ${BOLD}Start building:${RESET}`);
  console.log(`    1. Create a folder for your prototype`);
  console.log(`    2. Open it in Cursor`);
  console.log(`    3. Press ${BOLD}Cmd+L${RESET} and describe what you want:\n`);
  console.log(`       ${DIM}"Build me an RFI list page with status filters"${RESET}`);
  console.log(`       ${DIM}"Create an invoice flow — vendor, line items, review"${RESET}`);
  console.log(`       ${DIM}"Make a project dashboard with budget cards"${RESET}\n`);
  console.log(`  The AI handles everything. Just describe it in plain English.\n`);
}

console.log(`  ${DIM}Run this command again anytime to update.${RESET}\n`);
