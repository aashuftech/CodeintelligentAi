import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Problem from "../src/lib/db/models/problem.model";
import User from "../src/lib/db/models/user.model";
import { hashPassword } from "../src/lib/auth/password";

// Automatically load .env.local or .env if present
function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const filePath = path.resolve(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
          const [key, ...rest] = trimmed.split("=");
          const val = rest.join("=").trim().replace(/^["']|["']$/g, "");
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ai_interview_platform";

const seedProblems = [
  {
    title: "Two Sum Target Indices",
    slug: "two-sum-target-indices",
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

### Example 1:
**Input:** \`nums = [2,7,11,15], target = 9\`
**Output:** \`[0,1]\`
**Explanation:** Because nums[0] + nums[1] == 9, we return [0, 1].

### Example 2:
**Input:** \`nums = [3,2,4], target = 6\`
**Output:** \`[1,2]\`

### Constraints:
- \`2 <= nums.length <= 10^4\`
- \`-10^9 <= nums[i] <= 10^9\`
- \`-10^9 <= target <= 10^9\`
- Only one valid answer exists.`,
    difficulty: "easy",
    category: "DSA",
    tags: ["Array", "Hash Table", "Algorithms"],
    roleAffinity: ["Full Stack Engineer", "Backend Engineer", "Frontend Engineer"],
    starterCode: {
      python: `def two_sum(nums, target):
    # Write your O(N) solution here
    pass`,
      javascript: `function twoSum(nums, target) {
  // Write your O(N) solution here
  
}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  // Write your O(N) solution here
  return [];
}`,
      java: `public class Solution {
    public static int[] twoSum(int[] nums, int target) {
        return new int[]{};
    }
}`,
      cpp: `#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    return {};
}`,
      go: `package main

func twoSum(nums []int, target int) []int {
    return []int{}
}`,
    },
    testCases: [
      { input: "[[2,7,11,15], 9]", expectedOutput: "[0,1]", isHidden: false, explanation: "2 + 7 = 9" },
      { input: "[[3,2,4], 6]", expectedOutput: "[1,2]", isHidden: false, explanation: "2 + 4 = 6" },
      { input: "[[3,3], 6]", expectedOutput: "[0,1]", isHidden: false, explanation: "3 + 3 = 6" },
      { input: "[[1,5,8,12,19], 20]", expectedOutput: "[0,4]", isHidden: true, explanation: "Hidden test boundary" },
      { input: "[[-1,-2,-3,-4,-5], -8]", expectedOutput: "[2,4]", isHidden: true, explanation: "Negative integers" },
    ],
    hints: [
      "A brute force search using two nested loops takes O(N^2) time.",
      "How can you look up whether the complement (target - num) already exists in O(1) time?",
      "Use a Hash Map / Dictionary mapping elements to their respective indices.",
    ],
    timeLimitMs: 4000,
    memoryLimitMb: 128,
  },
  {
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating-characters",
    description: `Given a string \`s\`, find the length of the longest substring without repeating characters.

### Example 1:
**Input:** \`s = "abcabcbb"\`
**Output:** \`3\`
**Explanation:** The answer is "abc", with the length of 3.

### Example 2:
**Input:** \`s = "bbbbb"\`
**Output:** \`1\`
**Explanation:** The answer is "b", with the length of 1.

### Example 3:
**Input:** \`s = "pwwkew"\`
**Output:** \`3\`
**Explanation:** The answer is "wke", with length 3.

### Constraints:
- \`0 <= s.length <= 5 * 10^4\`
- \`s\` consists of English letters, digits, symbols and spaces.`,
    difficulty: "medium",
    category: "DSA",
    tags: ["Sliding Window", "Hash Table", "String"],
    roleAffinity: ["Full Stack Engineer", "Frontend Engineer", "Backend Engineer"],
    starterCode: {
      python: `def length_of_longest_substring(s: str) -> int:
    # Write your sliding window solution here
    return 0`,
      javascript: `function lengthOfLongestSubstring(s) {
  // Write your sliding window solution here
  return 0;
}`,
      typescript: `function lengthOfLongestSubstring(s: string): number {
  // Write your sliding window solution here
  return 0;
}`,
      java: `public class Solution {
    public static int lengthOfLongestSubstring(String s) {
        return 0;
    }
}`,
      cpp: `#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

int lengthOfLongestSubstring(string s) {
    return 0;
}`,
      go: `package main

func lengthOfLongestSubstring(s string) int {
    return 0
}`,
    },
    testCases: [
      { input: "\"abcabcbb\"", expectedOutput: "3", isHidden: false, explanation: "abc -> 3" },
      { input: "\"bbbbb\"", expectedOutput: "1", isHidden: false, explanation: "b -> 1" },
      { input: "\"pwwkew\"", expectedOutput: "3", isHidden: false, explanation: "wke -> 3" },
      { input: "\"\"", expectedOutput: "0", isHidden: true, explanation: "Empty string edge case" },
      { input: "\"dvdf\"", expectedOutput: "3", isHidden: true, explanation: "Non-contiguous duplicate jump" },
    ],
    hints: [
      "Use two pointers (left and right) to maintain a sliding window of distinct characters.",
      "Store the most recent index of each character in a map or set.",
      "When a duplicate is encountered, advance the left pointer past the previous occurrence.",
    ],
    timeLimitMs: 4000,
    memoryLimitMb: 128,
  },
  {
    title: "Coin Change Minimum Denominations",
    slug: "coin-change-minimum-denominations",
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.

### Example 1:
**Input:** \`coins = [1,2,5], amount = 11\`
**Output:** \`3\`
**Explanation:** 11 = 5 + 5 + 1 (3 coins)

### Example 2:
**Input:** \`coins = [2], amount = 3\`
**Output:** \`-1\`

### Constraints:
- \`1 <= coins.length <= 12\`
- \`1 <= coins[i] <= 2^31 - 1\`
- \`0 <= amount <= 10^4\``,
    difficulty: "medium",
    category: "DSA",
    tags: ["Dynamic Programming", "Breadth-First Search"],
    roleAffinity: ["Backend Engineer", "Full Stack Engineer"],
    starterCode: {
      python: `def coin_change(coins, amount):
    # Write your bottom-up DP solution here
    return -1`,
      javascript: `function coinChange(coins, amount) {
  // Write your bottom-up DP solution here
  return -1;
}`,
      typescript: `function coinChange(coins: number[], amount: number): number {
  return -1;
}`,
      java: `public class Solution {
    public static int coinChange(int[] coins, int amount) {
        return -1;
    }
}`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

int coinChange(vector<int>& coins, int amount) {
    return -1;
}`,
      go: `package main

func coinChange(coins []int, amount int) int {
    return -1
}`,
    },
    testCases: [
      { input: "[[1,2,5], 11]", expectedOutput: "3", isHidden: false, explanation: "5+5+1" },
      { input: "[[2], 3]", expectedOutput: "-1", isHidden: false, explanation: "Impossible" },
      { input: "[[1], 0]", expectedOutput: "0", isHidden: false, explanation: "Amount 0 requires 0 coins" },
      { input: "[[186,419,83,408], 6249]", expectedOutput: "20", isHidden: true, explanation: "Large amount DP" },
    ],
    hints: [
      "Let dp[i] represent the minimum coins required to make amount i.",
      "Initialize dp with amount + 1 (infinity sentinel) and dp[0] = 0.",
      "For each coin c and amount i >= c, dp[i] = min(dp[i], dp[i - c] + 1).",
    ],
    timeLimitMs: 4000,
    memoryLimitMb: 128,
  },
  {
    title: "Maximum Subarray Kadane Algorithm",
    slug: "maximum-subarray-kadane",
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

### Example 1:
**Input:** \`nums = [-2,1,-3,4,-1,2,1,-5,4]\`
**Output:** \`6\`
**Explanation:** The subarray \`[4,-1,2,1]\` has the largest sum 6.

### Example 2:
**Input:** \`nums = [1]\`
**Output:** \`1\`

### Constraints:
- \`1 <= nums.length <= 10^5\`
- \`-10^4 <= nums[i] <= 10^4\``,
    difficulty: "easy",
    category: "DSA",
    tags: ["Array", "Divide and Conquer", "Dynamic Programming"],
    roleAffinity: ["Full Stack Engineer", "Backend Engineer", "Frontend Engineer"],
    starterCode: {
      python: `def max_sub_array(nums):
    # Implement Kadane's O(N) algorithm
    return 0`,
      javascript: `function maxSubArray(nums) {
  // Implement Kadane's O(N) algorithm
  return 0;
}`,
      typescript: `function maxSubArray(nums: number[]): number {
  return 0;
}`,
      java: `public class Solution {
    public static int maxSubArray(int[] nums) {
        return 0;
    }
}`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

int maxSubArray(vector<int>& nums) {
    return 0;
}`,
      go: `package main

func maxSubArray(nums []int) int {
    return 0
}`,
    },
    testCases: [
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6", isHidden: false, explanation: "Subarray [4,-1,2,1]" },
      { input: "[1]", expectedOutput: "1", isHidden: false, explanation: "Single element" },
      { input: "[5,4,-1,7,8]", expectedOutput: "23", isHidden: false, explanation: "All positive sum" },
      { input: "[-1]", expectedOutput: "-1", isHidden: true, explanation: "Negative single element" },
      { input: "[-5,-2,-8,-1]", expectedOutput: "-1", isHidden: true, explanation: "All negative numbers" },
    ],
    hints: [
      "Keep track of the current subarray sum ending at each index.",
      "If the current sum becomes negative, reset it to the current element.",
      "Track the global maximum sum throughout the loop.",
    ],
    timeLimitMs: 4000,
    memoryLimitMb: 128,
  },
  {
    title: "Valid Parentheses String",
    slug: "valid-parentheses-string",
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

### Example 1:
**Input:** \`s = "()[]{}"\`
**Output:** \`true\`

### Example 2:
**Input:** \`s = "(]"\`
**Output:** \`false\`

### Constraints:
- \`1 <= s.length <= 10^4\`
- \`s\` consists of parentheses only \`'()[]{}'\`.`,
    difficulty: "easy",
    category: "DSA",
    tags: ["Stack", "String"],
    roleAffinity: ["Full Stack Engineer", "Frontend Engineer"],
    starterCode: {
      python: `def is_valid(s: str) -> bool:
    # Use stack to match matching brackets
    return False`,
      javascript: `function isValid(s) {
  // Use stack to match matching brackets
  return false;
}`,
      typescript: `function isValid(s: string): boolean {
  return false;
}`,
      java: `public class Solution {
    public static boolean isValid(String s) {
        return false;
    }
}`,
      cpp: `#include <string>
#include <stack>
using namespace std;

bool isValid(string s) {
    return false;
}`,
      go: `package main

func isValid(s string) bool {
    return false
}`,
    },
    testCases: [
      { input: "\"()[]{}\"", expectedOutput: "true", isHidden: false, explanation: "Matching brackets" },
      { input: "\"(]\"", expectedOutput: "false", isHidden: false, explanation: "Mismatched type" },
      { input: "\"([{}])\"", expectedOutput: "true", isHidden: false, explanation: "Nested valid" },
      { input: "\"[\"", expectedOutput: "false", isHidden: true, explanation: "Unclosed bracket" },
      { input: "\"]\"", expectedOutput: "false", isHidden: true, explanation: "Unopened closing bracket" },
    ],
    hints: [
      "A Stack (LIFO) is the ideal data structure for tracking nested bracket pairs.",
      "Push opening brackets onto the stack. When encountering a closing bracket, pop the stack and check matching type.",
      "After checking all characters, the stack must be completely empty.",
    ],
    timeLimitMs: 4000,
    memoryLimitMb: 128,
  },
];

async function seed() {
  console.log("Connecting to database at:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);

  console.log("Seeding default demo users...");
  const candidatePass = await hashPassword("password123");
  const adminPass = await hashPassword("password123");

  await User.findOneAndUpdate(
    { email: "candidate@example.com" },
    {
      name: "Alex Rivers",
      email: "candidate@example.com",
      passwordHash: candidatePass,
      role: "candidate",
      targetRole: "Full Stack Engineer",
      experienceLevel: "senior",
      skills: [
        { name: "Algorithms & Data Structures", category: "DSA", score: 85, assessedCount: 3 },
        { name: "System Design & Architecture", category: "SystemDesign", score: 78, assessedCount: 2 },
        { name: "Code Cleanliness & Style", category: "CodeQuality", score: 90, assessedCount: 3 },
        { name: "Problem Solving Approach", category: "ProblemSolving", score: 84, assessedCount: 3 },
        { name: "Technical Communication", category: "Communication", score: 82, assessedCount: 3 },
      ],
      totalInterviews: 3,
      averageScore: 84,
    },
    { upsert: true, new: true }
  );

  await User.findOneAndUpdate(
    { email: "admin@example.com" },
    {
      name: "Engineering Admin",
      email: "admin@example.com",
      passwordHash: adminPass,
      role: "admin",
      targetRole: "Principal Lead",
      experienceLevel: "lead",
      skills: [],
      totalInterviews: 0,
      averageScore: 100,
    },
    { upsert: true, new: true }
  );

  console.log("Seeding curated problem bank...");
  for (const prob of seedProblems) {
    await Problem.findOneAndUpdate({ slug: prob.slug }, prob, { upsert: true, new: true });
    console.log(`- Seeded: ${prob.title} (${prob.difficulty})`);
  }

  console.log("✅ Seeding completed successfully!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
