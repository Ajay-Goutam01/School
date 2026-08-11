/**
 * DEVELOPER-ONLY ADMIN PASSWORD RESET SCRIPT
 * ============================================
 * Run: npm run reset-admin
 *
 * Provides a secure, server-side-only mechanism for developers to reset
 * a school admin's password when the admin has forgotten it.
 *
 * SAFETY FEATURES:
 * - Blocked in production unless ALLOW_ADMIN_RESET=true is explicitly set.
 * - Never creates a public HTTP endpoint.
 * - Never prints the password.
 * - Always sets mustChangePassword = true after reset.
 * - Requires explicit terminal confirmation before saving.
 *
 * Supports both interactive TTY and non-interactive piped stdin.
 */

const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const Admin = require("./models/Admin");

// ──────────────────────────────────────────────────────
// PRODUCTION SAFETY GUARD
// ──────────────────────────────────────────────────────
const isProduction = process.env.NODE_ENV === "production";
const resetAllowed = process.env.ALLOW_ADMIN_RESET === "true";

if (isProduction && !resetAllowed) {
  console.error(
    "Admin provisioning/reset scripts are disabled in production unless explicitly authorized.",
  );
  process.exit(1);
}

if (isProduction && process.env.CONFIRM_ADMIN_RESET !== "YES") {
  console.error(
    "Admin provisioning/reset scripts are disabled in production unless explicitly authorized.",
  );
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not configured.");
  process.exit(1);
}

// ──────────────────────────────────────────────────────
// Piped vs TTY input handling
// ──────────────────────────────────────────────────────
let pipedLines = null;
let pipedIndex = 0;

const initStdin = () =>
  new Promise((resolve) => {
    if (process.stdin.isTTY) {
      resolve();
      return;
    }
    const chunks = [];
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => chunks.push(chunk));
    process.stdin.on("end", () => {
      const full = chunks.join("");
      pipedLines = full.split("\n").map((l) => l.replace(/\r/g, "").trim());
      resolve();
    });
  });

const ask = (question, { hidden = false } = {}) => {
  if (pipedLines !== null) {
    const answer = (pipedLines[pipedIndex] || "").trim();
    pipedIndex++;
    process.stdout.write(question + (hidden ? "[hidden]" : answer) + "\n");
    return Promise.resolve(answer);
  }
  const readline = require("readline");
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (ans) => {
      rl.close();
      resolve((ans || "").trim());
    });
  });
};

const askHidden = (question) => {
  if (pipedLines !== null) {
    return ask(question, { hidden: true });
  }
  if (!process.stdin.isTTY) {
    return ask(question, { hidden: true });
  }
  return new Promise((resolve) => {
    process.stdout.write(question);
    let value = "";
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    const onData = (char) => {
      if (char === "\r" || char === "\n" || char === "\u0004") {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdin.removeListener("data", onData);
        process.stdout.write("\n");
        resolve(value.trim());
      } else if (char === "\u007f" || char === "\b") {
        if (value.length > 0) {
          value = value.slice(0, -1);
          process.stdout.clearLine(0);
          process.stdout.cursorTo(0);
          process.stdout.write(question + "*".repeat(value.length));
        }
      } else if (char.charCodeAt(0) >= 32) {
        value += char;
        process.stdout.write("*");
      }
    };
    process.stdin.on("data", onData);
  });
};

// ──────────────────────────────────────────────────────
// Validation helpers
// ──────────────────────────────────────────────────────
const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

const BLOCKED_PASSWORDS = [
  "admin123",
  "password",
  "12345678",
  "123456789",
  "password123",
  "qwerty123",
  "letmein",
  "welcome1",
  "admin1234",
  "school123",
];
const isPasswordInsecure = (p) => {
  const normalized = p.toLowerCase();
  return (
    BLOCKED_PASSWORDS.includes(normalized) ||
    new Set(normalized).size < 4 ||
    /^(.)\1+$/.test(normalized)
  );
};

// ──────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────
const main = async () => {
  await initStdin();

  console.log("\n========================================");
  console.log("ADMIN PASSWORD RESET");
  console.log("====================");
  if (isProduction) {
    console.log("  ⚠ Running in PRODUCTION mode (ALLOW_ADMIN_RESET=true).\n");
  } else {
    console.log("  [Development / Staging]\n");
  }

  try {
    await connectDB();

    // ── Collect email ──
    let email = "";
    while (!email) {
      const raw = await ask("Admin Email: ");
      const normalized = raw.toLowerCase().trim();
      if (!normalized) {
        console.log("  ✖ Email is required.\n");
      } else if (!isValidEmail(normalized)) {
        console.log("  ✖ Invalid email format.\n");
      } else {
        email = normalized;
      }
    }

    // ── Verify admin exists ──
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log(`\n  ✖ No admin account found for: ${email}`);
      console.log('    Use "npm run create-admin" to create a new admin.\n');
      process.exit(1);
    }

    console.log(`\n  Admin found: ${admin.name} <${admin.email}>`);

    // ── New temporary password ──
    let password = "";
    while (!password) {
      const pwd = await askHidden("New Temporary Password: ");
      if (!pwd) {
        console.log("  ✖ Password is required.\n");
      } else if (pwd.length < 8) {
        console.log("  ✖ Password must be at least 8 characters.\n");
      } else if (isPasswordInsecure(pwd)) {
        console.log(
          "  ✖ That password is too common. Choose a stronger one.\n",
        );
      } else {
        password = pwd;
      }
    }

    // ── Explicit confirmation ──
    const confirm = await ask(
      `\n  Confirm reset password for ${email}? (yes/no): `,
    );
    if (confirm.toLowerCase() !== "yes") {
      console.log("\n  Password reset cancelled. No changes were made.\n");
      process.exit(0);
    }

    // ── Apply reset — bcryptjs hashing done by model pre-save hook ──
    admin.password = password;
    admin.mustChangePassword = true;
    await admin.save();

    console.log("\n========================================");
    console.log("✓ Password reset successfully.");
    console.log(`  Email:              ${email}`);
    console.log("  Temporary password configured.");
    console.log("  mustChangePassword: true");
    console.log(
      "\n  ➜ Securely provide the temporary password to the school admin.",
    );
    console.log(
      "  ➜ The admin will be required to change the password on next login.\n",
    );

    process.exit(0);
  } catch (err) {
    console.error("\n✖ Error during password reset:", err.message);
    process.exit(1);
  }
};

main();
