import { TrunkLinter, linterTestCase } from "tests/utils";

const linter = new TrunkLinter("tach");

linter.runLinter(
  [
    linterTestCase({
      linterName: "tach",
      testName: "basic",
      expectation: "issues",
    }),
  ],
  {
    env: {
      TRUNK_LINTER_IGNORE_CONFIGS: "true",
    },
  },
);
