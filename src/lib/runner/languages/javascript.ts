import vm from "node:vm";
import { ExecutionRequest, ExecutionResult, SingleTestResult } from "../types";

/**
 * Normalizes values for comparison (handling JSON strings, numbers, arrays, objects, booleans, trimmed strings)
 */
function normalizeOutput(val: unknown): string {
  if (val === undefined) return "undefined";
  if (val === null) return "null";
  if (typeof val === "object") {
    try {
      return JSON.stringify(val);
    } catch {
      return String(val);
    }
  }
  return String(val).trim();
}

function areOutputsEqual(actual: string, expected: string): boolean {
  const normActual = actual.trim();
  const normExpected = expected.trim();

  if (normActual === normExpected) return true;

  try {
    const parsedActual = JSON.parse(normActual);
    const parsedExpected = JSON.parse(normExpected);

    // Deep compare
    return JSON.stringify(parsedActual) === JSON.stringify(parsedExpected);
  } catch {
    return false;
  }
}

export async function runJavaScript(req: ExecutionRequest): Promise<ExecutionResult> {
  const { code, testCases, timeLimitMs = 4000 } = req;
  const testResults: SingleTestResult[] = [];
  let totalTime = 0;
  let peakMem = 0;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const stdoutLogs: string[] = [];
    const stderrLogs: string[] = [];

    // Create isolated sandbox context with safe global objects
    const sandbox: Record<string, any> = {
      console: {
        log: (...args: unknown[]) => {
          stdoutLogs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" "));
        },
        warn: (...args: unknown[]) => {
          stdoutLogs.push("[WARN] " + args.map((a) => String(a)).join(" "));
        },
        error: (...args: unknown[]) => {
          stderrLogs.push("[ERROR] " + args.map((a) => String(a)).join(" "));
        },
      },
      Math,
      Date,
      JSON,
      parseInt,
      parseFloat,
      isNaN,
      isFinite,
      Array,
      Object,
      String,
      Number,
      Boolean,
      RegExp,
      Map,
      Set,
      BigInt,
      __rawInputStr: tc.input,
    };

    const context = vm.createContext(sandbox);

    const testExecutionHarness = `
      ${code}

      // Auto-detect entry function
      let entryFunc = null;
      if (typeof solution === 'function') entryFunc = solution;
      else if (typeof solve === 'function') entryFunc = solve;
      else if (typeof twoSum === 'function') entryFunc = twoSum;
      else if (typeof lengthOfLongestSubstring === 'function') entryFunc = lengthOfLongestSubstring;
      else if (typeof maxSubArray === 'function') entryFunc = maxSubArray;
      else if (typeof reverseList === 'function') entryFunc = reverseList;
      else if (typeof isValid === 'function') entryFunc = isValid;
      else if (typeof climbStairs === 'function') entryFunc = climbStairs;
      else if (typeof coinChange === 'function') entryFunc = coinChange;
      else if (typeof mergeKLists === 'function') entryFunc = mergeKLists;
      else if (typeof trap === 'function') entryFunc = trap;
      else if (typeof wordBreak === 'function') entryFunc = wordBreak;
      else if (typeof longestCommonSubsequence === 'function') entryFunc = longestCommonSubsequence;
      else {
        const globalKeys = Object.keys(this);
        for (let j = globalKeys.length - 1; j >= 0; j--) {
          const k = globalKeys[j];
          if (typeof this[k] === 'function' && !['parseInt','parseFloat','isNaN','isFinite'].includes(k)) {
            entryFunc = this[k];
            break;
          }
        }
      }

      if (!entryFunc) {
        throw new Error("No callable solution function found in code. Please declare a solution function.");
      }

      function __parseArgs(raw) {
        const str = (raw || "").trim();
        // 1. Check if raw is already valid JSON
        try {
          const direct = JSON.parse(str);
          if (Array.isArray(direct)) {
            if (entryFunc.length === 1 && !Array.isArray(direct[0])) {
              return [direct];
            }
            if (entryFunc.length > 1 && Array.isArray(direct[0])) {
              return direct;
            }
            if (entryFunc.length <= 1) {
              return [direct];
            }
            return direct;
          }
          return [direct];
        } catch {
          // 2. Try wrapping as comma-separated arguments: "[" + str + "]"
          try {
            const tuple = JSON.parse("[" + str + "]");
            if (Array.isArray(tuple)) {
              return tuple;
            }
          } catch {}
          return [str];
        }
      }

      const __finalArgs = __parseArgs(__rawInputStr);
      entryFunc.apply(null, __finalArgs);
    `;

    const start = performance.now();
    let actualOutput = "";
    let errorMsg: string | undefined;
    let passed = false;

    try {
      const script = new vm.Script(testExecutionHarness, {
        filename: "solution.js",
      });

      const memBefore = process.memoryUsage().heapUsed;
      const rawResult = script.runInContext(context, {
        timeout: timeLimitMs,
        displayErrors: true,
      });
      const memAfter = process.memoryUsage().heapUsed;
      const memDiff = Math.max(0, Math.round((memAfter - memBefore) / 1024));
      peakMem = Math.max(peakMem, memDiff);

      actualOutput = normalizeOutput(rawResult);
      passed = areOutputsEqual(actualOutput, tc.expectedOutput);
    } catch (err: unknown) {
      const e = err as Error;
      if (e.message?.includes("Script execution timed out")) {
        errorMsg = `Time Limit Exceeded (${timeLimitMs}ms)`;
      } else {
        errorMsg = e.message || String(e);
      }
      actualOutput = errorMsg;
      passed = false;
    }

    const execTime = Math.round((performance.now() - start) * 100) / 100;
    totalTime += execTime;

    testResults.push({
      testCaseIndex: i,
      passed,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      actualOutput,
      stdout: stdoutLogs.join("\n"),
      stderr: stderrLogs.join("\n"),
      executionTimeMs: execTime,
      memoryKb: peakMem || 512,
      error: errorMsg,
      isHidden: tc.isHidden,
    });

    if (errorMsg?.includes("Time Limit Exceeded")) {
      break;
    }
  }

  const passedCount = testResults.filter((t) => t.passed).length;
  let status: ExecutionResult["status"] = "passed";

  if (testResults.some((t) => t.error?.includes("Time Limit Exceeded"))) {
    status = "timeout";
  } else if (testResults.some((t) => t.error && !t.error.includes("No callable"))) {
    status = "runtime_error";
  } else if (passedCount < testCases.length) {
    status = "failed";
  }

  return {
    status,
    passedTests: passedCount,
    totalTests: testCases.length,
    testResults,
    totalExecutionTimeMs: Math.round(totalTime * 100) / 100,
    peakMemoryKb: peakMem || 1024,
  };
}
