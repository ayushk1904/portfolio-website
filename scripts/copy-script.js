import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, resolve, join } from "node:path";

const rootDir = resolve(process.cwd());
const distDir = resolve(rootDir, "dist");
const sourceFile = resolve(rootDir, "script.js");
const targetFile = resolve(distDir, "script.js");
const assetsSourceDir = resolve(rootDir, "assets");
const assetsTargetDir = resolve(distDir, "assets");

if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

mkdirSync(dirname(targetFile), { recursive: true });
copyFileSync(sourceFile, targetFile);

if (existsSync(assetsSourceDir)) {
  mkdirSync(assetsTargetDir, { recursive: true });

  const copyTree = (sourceDir, targetDir) => {
    for (const entry of readdirSync(sourceDir)) {
      const sourcePath = join(sourceDir, entry);
      const targetPath = join(targetDir, entry);
      const entryStat = statSync(sourcePath);

      if (entryStat.isDirectory()) {
        mkdirSync(targetPath, { recursive: true });
        copyTree(sourcePath, targetPath);
      } else if (entryStat.isFile()) {
        copyFileSync(sourcePath, targetPath);
      }
    }
  };

  copyTree(assetsSourceDir, assetsTargetDir);
}
