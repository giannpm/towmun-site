// Scanne images/portfolio/ et images/flash/, regroupe les photos par
// pièce (piece-02, piece-02b, piece-02c... ensemble), et régénère
// js/portfolio-data.js et js/flash-data.js automatiquement.
//
// Ce script tourne tout seul à chaque déploiement Netlify (voir
// netlify.toml), tu n'as rien à lancer à la main.

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;

function listImages(dir) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter(function (f) { return IMAGE_EXT.test(f); })
    .sort();
}

// A group key is the filename with any trailing single letter
// (right before the extension) stripped off, so piece-02.jpg,
// piece-02b.jpg and piece-02c.jpg all fall under "piece-02".
function groupFiles(files) {
  const pattern = /^(.*?)([a-z]?)\.(jpe?g|png|webp)$/i;
  const groups = {};
  const order = [];

  files.forEach(function (name) {
    const match = name.match(pattern);
    if (!match) return;
    const key = match[1];
    const letter = match[2] || "";
    if (!groups[key]) {
      groups[key] = [];
      order.push(key);
    }
    groups[key].push({ name: name, letter: letter });
  });

  return order.map(function (key) {
    const items = groups[key].sort(function (a, b) {
      return a.letter.localeCompare(b.letter);
    });
    return items.map(function (i) { return i.name; });
  });
}

function readExistingAlts(dataFilePath, folder) {
  // Preserves any "alt" text already written by hand, matched by the
  // first image filename of each block, so regenerating doesn't erase
  // descriptions already filled in.
  const alts = {};
  if (!fs.existsSync(dataFilePath)) return alts;

  const content = fs.readFileSync(dataFilePath, "utf8");
  const blockPattern = /"(images\/[^"]+)"[\s\S]*?alt:\s*"([^"]*)"/g;
  let match;
  while ((match = blockPattern.exec(content)) !== null) {
    const firstFile = path.basename(match[1]);
    alts[firstFile] = match[2];
  }
  return alts;
}

function buildDataFile(folder, varName, outFile) {
  const files = listImages(folder);
  const groups = groupFiles(files);
  const existingAlts = readExistingAlts(outFile, folder);

  const blocks = groups.map(function (files) {
    const firstFile = files[0];
    const alt = existingAlts[firstFile] || "À décrire";

    if (files.length === 1) {
      return '  {\n    src: "' + folder + "/" + files[0] + '",\n    alt: "' + alt + '"\n  }';
    }
    const list = files
      .map(function (f) { return '      "' + folder + "/" + f + '"'; })
      .join(",\n");
    return '  {\n    images: [\n' + list + '\n    ],\n    alt: "' + alt + '"\n  }';
  });

  const header =
    "// Généré automatiquement au déploiement par scripts/generate-data.js\n" +
    "// à partir du contenu de " + folder + "/. Ne pas éditer les images ici,\n" +
    '// éditer les textes "alt" est possible, ils sont conservés au prochain build.\n\n';

  const code =
    header +
    "const " + varName + " = [\n" + (blocks.length ? blocks.join(",\n") : "") + "\n];\n";

  fs.writeFileSync(outFile, code);
  console.log("Écrit " + outFile + " (" + groups.length + " élément(s))");
}

buildDataFile("images/portfolio", "portfolioPieces", path.join(ROOT, "js/portfolio-data.js"));
buildDataFile("images/flash", "flashDesigns", path.join(ROOT, "js/flash-data.js"));
