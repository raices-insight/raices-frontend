#!/usr/bin/env node

"use strict";

const fs = require("fs");
const path = require("path");

const raw = process.argv[2] ?? "";
const version = raw.startsWith("v") ? raw.slice(1) : raw;
const parts = version.split(".");

if (parts.length < 3 || parts.some((p) => p === "")) {
  process.stderr.write(
    `\n  Error: version incompleta '${raw}'\n` +
      `         Se requieren exactamente 3 digitos: X.Y.Z  (ej: v0.1.1)\n` +
      `         Te falto agregar: ${parts.length === 1 ? "minor y patch" : "patch"}\n\n`,
  );
  process.exit(1);
}

if (!/^\d+\.\d+\.\d+$/.test(version)) {
  process.stderr.write(
    `\n  Error: version invalida '${raw}'\n` +
      `         Solo se permiten digitos en cada parte: X.Y.Z  (ej: v0.1.1)\n\n`,
  );
  process.exit(1);
}

const pkgPath = path.resolve(__dirname, "..", "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const prev = pkg.version;

pkg.version = version;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

process.stdout.write(`${prev} → ${version}\n`);
