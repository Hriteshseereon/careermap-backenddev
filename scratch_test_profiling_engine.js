import {
  calculateProfiling,
  validateProfilingAgainstTestCases
} from "./src/modules/psychometricassesment/profiling.engine.js";

import {
  TEST_CASES,
  PROFILING_QUESTIONS,
  PROFILING_DOMAINS,
  STAGE_BANDS,
  FLAGS_DEFINITIONS,
  STAGE_OUTCOMES,
  DOMAIN_STAGE_MEANINGS,
  RISK_LEVEL_SCALE
} from "./src/modules/psychometricassesment/profiling.constants.js";

console.log("=================================================");
console.log("🧪 TESTING PERSONAL PROFILING / CRI ENGINE (7 TEST CASES)");
console.log("=================================================");

const validation = validateProfilingAgainstTestCases();

console.log(`\nResults: ${validation.passedCases}/${validation.totalCases} test cases passed.`);

validation.results.forEach((r) => {
  if (r.passed) {
    console.log(`✅ [${r.caseId}] ${r.description} => PASSED`);
  } else {
    console.error(`❌ [${r.caseId}] ${r.description} => FAILED:`, r.diffs);
  }
});

if (validation.allPassed) {
  console.log("\n🎉 ALL 7 EXCEL TEST CASES MATCH 100% PERFECTLY!");
} else {
  console.error("\n💥 SOME TEST CASES FAILED!");
  process.exit(1);
}

// Also test sample calculation report output
console.log("\n--- Sample Calculation Report (T6: Decided early, under pressure) ---");
const sampleCalc = calculateProfiling(TEST_CASES[5].inputs);
console.log("Computed Domain Scores:", sampleCalc.domainScores);
console.log("Computed CRI:", sampleCalc.cri, "Stage:", sampleCalc.stageName, "Stage No:", sampleCalc.stageNo);
console.log("Flags Triggered:", sampleCalc.flags.list.map(f => `${f.flagId}: ${f.name}`));
console.log("Risk Level:", sampleCalc.risk.finalLabel, `(${sampleCalc.risk.finalLevel})`, "Escalated:", sampleCalc.risk.isEscalated);
console.log("Report Heading:", sampleCalc.report.heading);
console.log("Report Active Stage:", sampleCalc.report.stageTrack.currentStageName);
console.log("Report Risk Badge:", sampleCalc.report.riskBadge.text);
console.log("Report Notes Count:", sampleCalc.report.notesForYou.notes.length);
console.log("Counselor View lowestDomainScore:", sampleCalc.report.counselorView.lowestDomainScore);
console.log("✅ Profiling Engine verification completed successfully.");
