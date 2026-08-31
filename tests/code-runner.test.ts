import { describe, it, expect } from "vitest";
import { executeCode } from "../src/lib/runner/sandbox";

describe("Multi-Language Sandboxed Code Runner", () => {
  it("executes valid JavaScript Two Sum correctly", async () => {
    const code = `
      function twoSum(nums, target) {
        const map = new Map();
        for (let i = 0; i < nums.length; i++) {
          const comp = target - nums[i];
          if (map.has(comp)) return [map.get(comp), i];
          map.set(nums[i], i);
        }
        return [];
      }
    `;

    const result = await executeCode({
      code,
      language: "javascript",
      testCases: [
        { input: "[[2,7,11,15], 9]", expectedOutput: "[0,1]" },
        { input: "[[3,2,4], 6]", expectedOutput: "[1,2]" },
      ],
    });

    expect(result.status).toBe("passed");
    expect(result.passedTests).toBe(2);
    expect(result.totalTests).toBe(2);
  });

  it("executes JavaScript Coin Change with multi-argument comma-separated input", async () => {
    const code = `
      function coinChange(coins, amount) {
        let dp = new Array(amount + 1).fill(Infinity);
        dp[0] = 0;
        for (let i = 1; i <= amount; i++) {
          for (let coin of coins) {
            if (coin <= i) {
              dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
          }
        }
        return dp[amount] === Infinity ? -1 : dp[amount];
      }
    `;

    const result = await executeCode({
      code,
      language: "javascript",
      testCases: [
        { input: "[1, 2, 5], 11", expectedOutput: "3" },
        { input: "[2], 3", expectedOutput: "-1" },
        { input: "[1], 0", expectedOutput: "0" },
      ],
    });

    expect(result.status).toBe("passed");
    expect(result.passedTests).toBe(3);
  });

  it("executes valid Python solution correctly", async () => {
    const code = `
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        comp = target - num
        if comp in seen:
            return [seen[comp], i]
        seen[num] = i
    return []
    `;

    const result = await executeCode({
      code,
      language: "python",
      testCases: [
        { input: "[[2,7,11,15], 9]", expectedOutput: "[0, 1]" },
        { input: "[[3,2,4], 6]", expectedOutput: "[1, 2]" },
      ],
    });

    expect(result.status).toBe("passed");
    expect(result.passedTests).toBe(2);
  });

  it("handles TypeScript code by stripping annotations", async () => {
    const code = `
      interface Pair {
        a: number;
        b: number;
      }

      function twoSum(nums: number[], target: number): number[] {
        const map = new Map<number, number>();
        for (let i: number = 0; i < nums.length; i++) {
          const comp = target - nums[i];
          if (map.has(comp)) return [map.get(comp)!, i];
          map.set(nums[i], i);
        }
        return [];
      }
    `;

    const result = await executeCode({
      code,
      language: "typescript",
      testCases: [
        { input: "[[2,7,11,15], 9]", expectedOutput: "[0,1]" },
      ],
    });

    expect(result.status).toBe("passed");
    expect(result.passedTests).toBe(1);
  });

  it("catches infinite loops and terminates with timeout status", async () => {
    const code = `
      function twoSum(nums, target) {
        while (true) {
          // Infinite loop intentional
        }
      }
    `;

    const result = await executeCode({
      code,
      language: "javascript",
      testCases: [
        { input: "[[2,7,11,15], 9]", expectedOutput: "[0,1]" },
      ],
      timeLimitMs: 800, // short timeout for testing
    });

    expect(result.status).toBe("timeout");
    expect(result.passedTests).toBe(0);
    expect(result.testResults[0].error).toContain("Time Limit Exceeded");
  });

  it("catches syntax and runtime errors accurately", async () => {
    const code = `
      function twoSum(nums, target) {
        throw new Error("Custom runtime panic");
      }
    `;

    const result = await executeCode({
      code,
      language: "javascript",
      testCases: [
        { input: "[[2,7,11,15], 9]", expectedOutput: "[0,1]" },
      ],
    });

    expect(result.status).toBe("runtime_error");
    expect(result.passedTests).toBe(0);
    expect(result.testResults[0].error).toContain("Custom runtime panic");
  });
});
