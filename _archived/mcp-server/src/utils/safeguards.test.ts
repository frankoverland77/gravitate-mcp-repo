/**
 * Tests for the safeguards system
 * Run with: npm test or node safeguards.test.js
 */

import {
  analyzeUserRequest,
  generateClarificationQuestions,
  generateFallbackSuggestions,
  processSafeguards,
  formatSafeguardResponse,
} from "./safeguards.js";

// Test cases for different scenarios user might encounter
const testCases = [
  // High confidence matches (should proceed normally)
  {
    input: "create a product grid",
    expectedConfidence: "high",
    description: "Clear grid creation request",
  },
  {
    input: "add a price column to ProductGrid",
    expectedConfidence: "high",
    description: "Clear column modification request",
  },
  {
    input: "change ProductGrid to OSP theme",
    expectedConfidence: "high",
    description: "Clear theme change request",
  },

  // Medium confidence (needs clarification)
  {
    input: "make something editable",
    expectedConfidence: "medium",
    description: "Ambiguous editable request",
  },
  {
    input: "change the styling",
    expectedConfidence: "medium",
    description: "Vague styling request",
  },
  {
    input: "create a new component",
    expectedConfidence: "medium",
    description: "Generic component creation",
  },

  // Low confidence (needs fallback suggestions)
  {
    input: "integrate with my database",
    expectedConfidence: "low",
    description: "Outside scope - database integration",
  },
  {
    input: "deploy to production",
    expectedConfidence: "low",
    description: "Outside scope - deployment",
  },
  {
    input: "add machine learning predictions",
    expectedConfidence: "low",
    description: "Outside scope - ML functionality",
  },
  {
    input: "fix the bug in line 42",
    expectedConfidence: "low",
    description: "Outside scope - debugging specific code",
  },

  // Edge cases user might try
  {
    input: "do some random stuff",
    expectedConfidence: "low",
    description: "Completely vague request",
  },
  {
    input: "hello world",
    expectedConfidence: "low",
    description: "Non-task related greeting",
  },
  {
    input: "asdfghjkl",
    expectedConfidence: "low",
    description: "Random typing",
  },
  {
    input: "",
    expectedConfidence: "low",
    description: "Empty request",
  },
];

function runTests() {
  console.log("🧪 Testing Safeguards System\n");

  let passed = 0;
  let total = testCases.length;

  testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.description}`);
    console.log(`Input: "${testCase.input}"`);

    try {
      // Test analysis
      const analysis = analyzeUserRequest(testCase.input);
      const safeguardResult = processSafeguards(testCase.input);
      const response = formatSafeguardResponse(safeguardResult);

      // Check confidence levels
      let actualConfidence = "low";
      if (safeguardResult.confidence >= 0.8) actualConfidence = "high";
      else if (safeguardResult.confidence >= 0.4) actualConfidence = "medium";

      const confidenceMatch = actualConfidence === testCase.expectedConfidence;

      console.log(`Expected confidence: ${testCase.expectedConfidence}`);
      console.log(
        `Actual confidence: ${actualConfidence} (${safeguardResult.confidence.toFixed(
          2
        )})`
      );
      console.log(`Exact matches: ${analysis.exactMatches.length}`);
      console.log(`Partial matches: ${analysis.partialMatches.length}`);

      if (response) {
        console.log(`Response preview: "${response.substring(0, 100)}..."`);
      } else {
        console.log("Response: (proceeding normally - no safeguard response)");
      }

      if (confidenceMatch) {
        console.log("✅ PASS\n");
        passed++;
      } else {
        console.log("❌ FAIL - Confidence mismatch\n");
      }
    } catch (error) {
      console.log(`❌ FAIL - Error: ${error}\n`);
    }
  });

  console.log(`\n📊 Results: ${passed}/${total} tests passed`);

  if (passed === total) {
    console.log(
      "🎉 All tests passed! The safeguards system is working correctly."
    );
  } else {
    console.log("⚠️  Some tests failed. Review the implementation.");
  }
}

// Additional function to test specific scenarios
function testSpecificScenarios() {
  console.log("\n🔍 Testing Specific user Scenarios\n");

  const userScenarios = [
    "I want to build a machine learning model",
    "How do I connect to my PostgreSQL database?",
    "Can you debug this React component?",
    "Make the grid sortable and filterable",
    "Export data to Excel",
    "Add authentication to my app",
    "Create a mobile responsive design",
    "Optimize for performance",
    "Add unit tests",
    "Set up CI/CD pipeline",
  ];

  userScenarios.forEach((scenario, index) => {
    console.log(`Scenario ${index + 1}: "${scenario}"`);

    const result = processSafeguards(scenario);
    const response = formatSafeguardResponse(result);

    if (result.shouldProceed) {
      console.log("✅ Would proceed with existing tools");
    } else {
      console.log("🛡️ Safeguards activated");
      if (result.clarificationNeeded) {
        console.log("📝 Would ask for clarification");
      }
      if (result.suggestions) {
        console.log("💡 Would provide alternatives");
      }
    }
    console.log(`Confidence: ${result.confidence.toFixed(2)}\n`);
  });
}

// Run the tests
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
  testSpecificScenarios();
}
