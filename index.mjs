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
const RESET = isTTY ? "\x1b[0m" : "";

const step = (msg) => console.log(`\n${ORANGE}▸${RESET} ${BOLD}${msg}${RESET}`);
const ok = (msg) => console.log(`  ${GREEN}✓${RESET} ${msg}`);
const warn = (msg) => console.log(`  ${RED}✗${RESET} ${msg}`);
const info = (msg) => console.log(`  ${DIM}${msg}${RESET}`);

const isUpdate = existsSync(SKILL_FILE);

step("Checking prerequisites");

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
ok("Cursor found");

step(isUpdate ? "Updating the Procore Prototype skill" : "Installing the Procore Prototype skill");

try {
  mkdirSync(SKILL_DIR, { recursive: true });
  const content = readFileSync(BUNDLED_SKILL, "utf-8");
  writeFileSync(SKILL_FILE, content, "utf-8");
  ok("Skill installed");
} catch (err) {
  warn("Could not install the skill file");
  info(err.message);
  process.exit(1);
}

ok("Skill file saved");

if (isUpdate) {
  console.log(`\n${GREEN}${BOLD}Updated!${RESET} You have the latest version.\n`);
} else {
  console.log(`\n${GREEN}${BOLD}You're all set!${RESET}\n`);
  console.log(`  ${BOLD}Quick check:${RESET}`);
  console.log(`    Open Cursor > Settings > Rules`);
  console.log(`    You should see ${BOLD}"procore-prototype"${RESET} listed under User Rules.`);
  console.log(`    If it's there, you're good.\n`);
  console.log(`  ${BOLD}To start building:${RESET}`);
  console.log(`    1. Create a new folder for your prototype ${DIM}(or open an existing one)${RESET}`);
  console.log(`    2. Open the chat ${DIM}(Cmd+L on Mac)${RESET}`);
  console.log(`    3. Describe what you want, like:`);
  console.log(`       ${DIM}"Build me an RFI list page with status filters"${RESET}\n`);
  console.log(`  The AI handles everything — project setup, code, components.`);
  console.log(`  Just describe it in plain English.\n`);
}

console.log(`  ${DIM}To update later: run this same command again${RESET}\n`);
