import { spawn } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const nextDir = path.join(cwd, ".next");
const stableDistDirName = ".next-stable";
const stableNextDir = path.join(cwd, stableDistDirName);
const maxAutoRestarts = 1;
const extraArgs = process.argv.slice(2);

let restartCount = 0;
let child = null;
let recoveredForCurrentRun = false;

function log(msg) {
  process.stdout.write(`[dev:stable] ${msg}\n`);
}

function isIgnorableCleanupError(error) {
  return (
    error &&
    typeof error === "object" &&
    ["EPERM", "EBUSY", "ENOTEMPTY"].includes(error.code)
  );
}

function tryRemoveDir(dirPath, label, reason) {
  if (!existsSync(dirPath)) return;

  try {
    rmSync(dirPath, { recursive: true, force: true });
    log(`Cleared ${label} (${reason}).`);
  } catch (error) {
    if (isIgnorableCleanupError(error)) {
      log(
        `Skipping ${label} cleanup due to lock (${error.code}); continuing startup.`
      );
      return;
    }

    throw error;
  }
}

function cleanNext(reason) {
  tryRemoveDir(nextDir, ".next", reason);
  tryRemoveDir(stableNextDir, stableDistDirName, reason);
}

function runPreflight() {
  if (cwd.toLowerCase().includes("onedrive")) {
    log("Warning: project is in OneDrive path; chunk invalidation can happen in dev mode.");
  }
  cleanNext("startup preflight");
}

function isChunkCorruption(output) {
  return (
    output.includes("Cannot find module './") &&
    output.includes(".next\\server\\webpack-runtime.js")
  );
}

function startDev() {
  recoveredForCurrentRun = false;

  child = spawn("npx", ["next", "dev", ...extraArgs], {
    cwd,
    shell: true,
    stdio: ["inherit", "pipe", "pipe"],
    env: {
      ...process.env,
      NEXT_DIST_DIR: stableDistDirName,
    },
  });

  child.stdout.on("data", (buf) => {
    const text = buf.toString();
    process.stdout.write(text);

    if (!recoveredForCurrentRun && isChunkCorruption(text)) {
      recoveredForCurrentRun = true;
      tryAutoRecover("stdout");
    }
  });

  child.stderr.on("data", (buf) => {
    const text = buf.toString();
    process.stderr.write(text);

    if (!recoveredForCurrentRun && isChunkCorruption(text)) {
      recoveredForCurrentRun = true;
      tryAutoRecover("stderr");
    }
  });

  child.on("exit", (code, signal) => {
    if (signal === "SIGTERM" || signal === "SIGINT") {
      return;
    }

    if (code !== 0 && restartCount <= maxAutoRestarts) {
      restartCount += 1;
      cleanNext(`child exit code ${code}`);
      log(`Restarting Next dev (${restartCount}/${maxAutoRestarts})...`);
      startDev();
      return;
    }

    process.exit(code ?? 0);
  });
}

function tryAutoRecover(source) {
  if (!child) return;

  if (restartCount >= maxAutoRestarts) {
    log(`Detected chunk corruption via ${source}, but auto-restart budget is exhausted.`);
    return;
  }

  restartCount += 1;
  log(`Detected chunk corruption via ${source}. Auto-recovering (${restartCount}/${maxAutoRestarts})...`);
  cleanNext("detected chunk corruption");
  child.kill("SIGTERM");
}

process.on("SIGINT", () => {
  if (child) child.kill("SIGINT");
  process.exit(0);
});

process.on("SIGTERM", () => {
  if (child) child.kill("SIGTERM");
  process.exit(0);
});

runPreflight();
startDev();
