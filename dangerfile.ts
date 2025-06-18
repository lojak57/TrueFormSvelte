import { danger, fail, message, warn } from "danger";

// Check for backup files
const backupFiles = danger.git.created_files
  .concat(danger.git.modified_files)
  .filter(
    (file) =>
      file.includes("BACKUP") ||
      file.includes("backup") ||
      file.includes("_copy") ||
      file.includes(".copy") ||
      file.endsWith("_backup.svelte") ||
      file.endsWith("_backup.ts") ||
      file.endsWith("_backup.js")
  );

if (backupFiles.length > 0) {
  fail(
    `❌ Backup files detected. Please remove these files and rely on Git for version control:\n${backupFiles
      .map((f) => `- ${f}`)
      .join("\n")}`
  );
}

// Check for oversized files (Phase 3 enforcement)
const OVERSIZED_LIMIT = 400; // lines
const oversizedFiles = danger.git.created_files
  .concat(danger.git.modified_files)
  .filter(
    (file) =>
      file.endsWith(".svelte") || file.endsWith(".ts") || file.endsWith(".js")
  )
  .filter((file) => {
    // We'll implement line counting logic here when files are actually changed
    // For now, just warn about known problematic files
    return (
      file.includes("SiteRequestWizard.svelte") ||
      file.includes("Header.svelte")
    );
  });

if (oversizedFiles.length > 0) {
  warn(
    `⚠️ These files may exceed the 200/300/400 LOC limits defined in our architecture guidelines:\n${oversizedFiles
      .map((f) => `- ${f}`)
      .join("\n")}`
  );
}

// Check for TODO comments in PR title or description
const todoPattern = /TODO|FIXME|HACK|XXX/i;
const prHasTodos =
  todoPattern.test(danger.github.pr.title) ||
  todoPattern.test(danger.github.pr.body || "");

if (prHasTodos) {
  warn(
    "⚠️ TODO/FIXME mentioned in PR. Consider creating GitHub issues for tracking."
  );
}

// Check for missing tests
const hasNewComponents = danger.git.created_files
  .filter((file) => file.endsWith(".svelte") && file.includes("/components/"))
  .filter((file) => !file.includes(".test."));

const missingTests = hasNewComponents.filter((component) => {
  const testFile = component.replace(".svelte", ".test.ts");
  return (
    !danger.git.created_files.includes(testFile) &&
    !danger.git.modified_files.includes(testFile)
  );
});

if (missingTests.length > 0) {
  warn(
    `⚠️ New components without corresponding tests:\n${missingTests
      .map((f) => `- ${f}`)
      .join("\n")}`
  );
}

// Success message
if (backupFiles.length === 0) {
  message("✅ No backup files detected - good job keeping the codebase clean!");
}
