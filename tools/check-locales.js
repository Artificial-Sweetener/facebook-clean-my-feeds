/**
 * Localization Gap Finder
 * Compares all language definitions in translations.js against the 'en' baseline.
 */

const { translations } = require('../src/ui/i18n/translations.js');

const enKeys = Object.keys(translations.en);
let totalGaps = 0;

console.log('🔍 Checking for localization gaps...\n');

Object.keys(translations).forEach(lang => {
  if (lang === 'en') return;

  const langKeys = translations[lang];
  const missingKeys = enKeys.filter(key => !Object.prototype.hasOwnProperty.call(langKeys, key));

  if (missingKeys.length > 0) {
    totalGaps += missingKeys.length;
    console.log(`[${lang}] ❌ Missing ${missingKeys.length} keys:`);
    missingKeys.forEach(k => console.log(`  - ${k}`));
    console.log(''); // Empty line for readability
  } else {
    console.log(`[${lang}] ✅ Parity check passed`);
  }
});

if (totalGaps === 0) {
  console.log('✨ All languages are in parity with English!');
} else {
  console.log(`⚠️  Found ${totalGaps} total missing translations.`);
  process.exit(1); // Exit with error code for CI/CD usage
}
