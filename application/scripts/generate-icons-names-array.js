const { iconNames } = require("lucide-react/dynamic");
const path = require("path");
const fs = require("fs");

if (fs.existsSync(`${process.cwd()}/lib/lucide-icon-names.ts`)) {
  console.warn("Already Existing Icons Array File, We will override it");
  fs.unlinkSync(`${process.cwd()}/lib/lucide-icon-names.ts`);
  console.info(`[Deleted]: ${process.cwd()}/lib/lucide-icon-names.ts`);
  console.log("Generating new one");
}

fs.writeFileSync(
  "lib/lucide-icon-names.ts",
  "// Auto-generated from lucide-react. Do NOT import from lucide-react/dynamic in client code.\nexport const LUCIDE_ICON_NAMES = " +
    JSON.stringify(iconNames, null, 2) +
    " as const;\n",
);

console.info(
  `Icons Array Generated Within ${process.cwd()}/lib/lucide-icon-names.ts`,
);
