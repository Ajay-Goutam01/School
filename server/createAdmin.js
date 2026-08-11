/**
 * SCHOOL ADMIN CREATION SCRIPT
 * =============================
 * Run: npm run create-admin
 *
 * Interactively creates the INITIAL admin account for a new school deployment.
 * - Prompts for admin name, email, and temporary password.
 * - Never reads ADMIN_PASSWORD from .env.
 * - Never overwrites an existing admin account.
 * - Password is hashed via the Admin model's pre-save bcrypt hook.
 * - Sets mustChangePassword: true so the admin must change password on first login.
 *
 * Supports both interactive TTY and non-interactive piped stdin (e.g. CI pipelines).
 */

const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const Admin = require("./models/Admin");

const isProduction = process.env.NODE_ENV === "production";
const provisioningAuthorized =
  process.env.ALLOW_ADMIN_CREATE === "true" &&
  process.env.CONFIRM_ADMIN_CREATE === "YES";

if (isProduction && !provisioningAuthorized) {
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

// When stdin is piped, read all lines upfront and serve them on demand.
// When stdin is a real terminal (TTY), prompt interactively.

let pipedLines = null; // null = TTY mode; array = piped mode
let pipedIndex = 0;

const initStdin = () =>
  new Promise((resolve) => {
    if (process.stdin.isTTY) {
      resolve(); // TTY: skip buffering
      return;
    }

    // Piped: read all stdin into buffer
    const chunks = [];
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => chunks.push(chunk));
    process.stdin.on("end", () => {
      const full = chunks.join("");
      pipedLines = full
        .split("\n")
        .map((l) => l.replace(/\r/g, "").trim())
        .filter((l, i, arr) => l !== "" || i < arr.length - 1); // keep intermediate blanks if any
      resolve();
    });
  });

// Read next answer from buffer (piped) or prompt interactively (TTY)
const ask = (question, { hidden = false } = {}) => {
  if (pipedLines !== null) {
    const answer = (pipedLines[pipedIndex] || "").trim();
    pipedIndex++;
    process.stdout.write(question + (hidden ? "[hidden]" : answer) + "\n");
    return Promise.resolve(answer);
  }

  // TTY: use readline for a single question
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

// Password: mask on TTY, read from buffer on piped
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
  console.log("SCHOOL ADMIN SETUP");
  console.log("==================\n");

  try {
    await connectDB();

    // ── Admin Name ──
    let name = "";
    while (!name) {
      name = await ask("Admin Name: ");
      if (!name) console.log("  ✖ Name is required.\n");
    }

    // ── Admin Email ──
    let email = "";
    while (!email) {
      const raw = await ask("Admin Email: ");
      const normalized = raw.toLowerCase().trim();
      if (!normalized) {
        console.log("  ✖ Email is required.\n");
      } else if (!isValidEmail(normalized)) {
        console.log("  ✖ Please enter a valid email address.\n");
      } else {
        email = normalized;
      }
    }

    // ── Check if admin already exists ──
    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log(
        "\n[!] An admin with this email already exists. No changes were made.",
      );
      console.log(
        '    Use "npm run reset-admin" to reset the password securely.\n',
      );
      process.exit(0);
    }

    // ── Temporary Password ──
    let password = "";
    while (!password) {
      const pwd = await askHidden("Temporary Password: ");
      if (!pwd) {
        console.log("  ✖ Password is required.\n");
      } else if (pwd.length < 8) {
        console.log("  ✖ Password must be at least 8 characters long.\n");
      } else if (isPasswordInsecure(pwd)) {
        console.log(
          "  ✖ That password is too common. Please choose a stronger one.\n",
        );
      } else {
        password = pwd;
      }
    }

    // ── Create admin — password hashed by model pre-save hook ──
    const admin = new Admin({
      name,
      email,
      password,
      role: "SuperAdmin",
      mustChangePassword: true,
    });

    await admin.save();

    console.log("\n========================================");
    console.log("✓ Admin created successfully.");
    console.log(`  Email:              ${email}`);
    console.log("  Temporary password configured.");
    console.log("  mustChangePassword: true");
    console.log(
      "\n  ➜ Share the email and temporary password privately with the school admin.",
    );
    console.log(
      "  ➜ The admin will be forced to change the password on first login.\n",
    );

    process.exit(0);
  } catch (err) {
    console.error("\n✖ Error during admin creation:", err.message);
    process.exit(1);
  }
};

main();
