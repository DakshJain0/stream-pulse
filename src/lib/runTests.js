import { runScoringTests } from './scoring.js';

console.log('=== Running 5 computePriority() Test Cases ===\n');

const { allPassed, results } = runScoringTests();

results.forEach((r, idx) => {
  const icon = r.passed ? '✓ PASS' : '✗ FAIL';
  console.log(`[${idx + 1}] ${icon}: ${r.title}`);
  console.log(`    Actual Score: ${r.actualScore} (Expected range: [${r.expectedRange.join(', ')}])`);
  console.log(`    Reasons: ${r.reasons.join(' | ')}`);
  if (!r.passed && r.missingReasons.length > 0) {
    console.log(`    MISSING expected reasons: ${r.missingReasons.join(', ')}`);
  }
  console.log('');
});

if (allPassed) {
  console.log('🎉 ALL 5 TEST CASES PASSED SUCCESSFULLY!\n');
  process.exit(0);
} else {
  console.error('❌ SOME TEST CASES FAILED!\n');
  process.exit(1);
}
