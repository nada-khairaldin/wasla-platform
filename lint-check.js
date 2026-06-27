import { ESLint } from "eslint";

(async function main() {
  const eslint = new ESLint();
  const results = await eslint.lintFiles(["src/**/*.ts", "src/**/*.tsx"]);
  
  const errors = results.filter(r => r.errorCount > 0);
  console.log(JSON.stringify(errors, null, 2));
})().catch((error) => {
  process.exitCode = 1;
  console.error(error);
});
