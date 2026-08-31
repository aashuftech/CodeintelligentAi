import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { ExecutionRequest, ExecutionResult, SingleTestResult } from "../types";

function normalizeOutput(val: string): string {
  return val.trim();
}

function areOutputsEqual(actual: string, expected: string): boolean {
  const normActual = actual.trim();
  const normExpected = expected.trim();

  if (normActual === normExpected) return true;

  try {
    const parsedActual = JSON.parse(normActual);
    const parsedExpected = JSON.parse(normExpected);
    return JSON.stringify(parsedActual) === JSON.stringify(parsedExpected);
  } catch {
    return false;
  }
}

export async function runPython(req: ExecutionRequest): Promise<ExecutionResult> {
  const { code, testCases, timeLimitMs = 5000 } = req;
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "py_sandbox_"));
  const scriptPath = path.join(tempDir, "solution.py");

  const runnerCode = `
import sys
import json
import time
import inspect
from typing import *

${code}

# Detect main function
user_funcs = [
    obj for name, obj in list(globals().items())
    if inspect.isfunction(obj) and not name.startswith('_') and obj.__module__ == '__main__'
]

target_func = None
known_names = ['solution', 'solve', 'two_sum', 'twoSum', 'maxSubArray', 'lengthOfLongestSubstring', 'reverseList', 'isValid', 'climbStairs', 'coinChange']
for name in known_names:
    if name in globals() and inspect.isfunction(globals()[name]):
        target_func = globals()[name]
        break

if not target_func and user_funcs:
    target_func = user_funcs[-1]

def run_test(raw_input):
    if not target_func:
        raise Exception("No solution function found in Python code.")
    
    str_input = (raw_input or "").strip()
    
    # 1. Try direct JSON parse
    try:
        direct = json.loads(str_input)
        if isinstance(direct, list):
            sig = inspect.signature(target_func)
            param_count = len(sig.parameters)
            if param_count == 1 and not (isinstance(direct[0], list) and len(direct) == 2):
                res = target_func(direct)
            elif param_count > 1 and len(direct) == param_count:
                res = target_func(*direct)
            else:
                try:
                    res = target_func(*direct)
                except:
                    res = target_func(direct)
        else:
            res = target_func(direct)
        return json.dumps(res)
    except:
        pass

    # 2. Try tuple parse "[" + str_input + "]"
    try:
        tuple_parsed = json.loads("[" + str_input + "]")
        if isinstance(tuple_parsed, list):
            try:
                res = target_func(*tuple_parsed)
            except:
                res = target_func(tuple_parsed)
            return json.dumps(res)
    except:
        pass

    # 3. Fallback as raw string
    res = target_func(raw_input)
    try:
        return json.dumps(res)
    except:
        return str(res)

if __name__ == '__main__':
    test_cases = ${JSON.stringify(testCases)}
    results = []

    for i, tc in enumerate(test_cases):
        t_start = time.perf_counter()
        try:
            out = run_test(tc['input'])
            exec_time = round((time.perf_counter() - t_start) * 1000, 2)
            results.append({
                "index": i,
                "passed": True,
                "output": out,
                "timeMs": exec_time,
                "error": None
            })
        except Exception as e:
            exec_time = round((time.perf_counter() - t_start) * 1000, 2)
            results.append({
                "index": i,
                "passed": False,
                "output": str(e),
                "timeMs": exec_time,
                "error": str(e)
            })

    print("---RUNNER_OUTPUT_START---")
    print(json.dumps(results))
    print("---RUNNER_OUTPUT_END---")
`;

  await fs.writeFile(scriptPath, runnerCode, "utf-8");

  return new Promise<ExecutionResult>((resolve) => {
    const pythonExecutable = process.platform === "win32" ? "python" : "python3";
    const start = performance.now();

    const proc = spawn(pythonExecutable, [scriptPath], {
      timeout: timeLimitMs + 1000,
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      proc.kill("SIGKILL");
    }, timeLimitMs);

    proc.stdout.on("data", (d) => {
      stdout += d.toString();
    });

    proc.stderr.on("data", (d) => {
      stderr += d.toString();
    });

    proc.on("close", async (codeExit) => {
      clearTimeout(timer);
      const totalExecTime = Math.round((performance.now() - start) * 100) / 100;

      // Cleanup
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch (e) {
        // ignore
      }

      if (timedOut) {
        return resolve({
          status: "timeout",
          passedTests: 0,
          totalTests: testCases.length,
          testResults: testCases.map((tc, idx) => ({
            testCaseIndex: idx,
            passed: false,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: `Time Limit Exceeded (${timeLimitMs}ms)`,
            stdout: "",
            stderr: "Execution timed out",
            executionTimeMs: timeLimitMs,
            memoryKb: 2048,
            error: "Time Limit Exceeded",
            isHidden: tc.isHidden,
          })),
          totalExecutionTimeMs: timeLimitMs,
          peakMemoryKb: 2048,
        });
      }

      if (codeExit !== 0 && !stdout.includes("---RUNNER_OUTPUT_START---")) {
        return resolve({
          status: stderr.includes("SyntaxError") ? "compilation_error" : "runtime_error",
          passedTests: 0,
          totalTests: testCases.length,
          testResults: testCases.map((tc, idx) => ({
            testCaseIndex: idx,
            passed: false,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: stderr || "Execution failed",
            stdout,
            stderr,
            executionTimeMs: totalExecTime,
            memoryKb: 2048,
            error: stderr,
            isHidden: tc.isHidden,
          })),
          totalExecutionTimeMs: totalExecTime,
          peakMemoryKb: 2048,
          compilerError: stderr,
        });
      }

      try {
        const parts = stdout.split("---RUNNER_OUTPUT_START---");
        const jsonPart = parts[1].split("---RUNNER_OUTPUT_END---")[0].trim();
        const pyResults = JSON.parse(jsonPart);

        const singleResults: SingleTestResult[] = [];
        let passedCount = 0;

        for (let i = 0; i < testCases.length; i++) {
          const tc = testCases[i];
          const r = pyResults[i];
          const actualOutput = r ? r.output : "No output";
          const isPassed = !r?.error && areOutputsEqual(actualOutput, tc.expectedOutput);

          if (isPassed) passedCount++;

          singleResults.push({
            testCaseIndex: i,
            passed: isPassed,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput,
            stdout: parts[0]?.trim() || "",
            stderr,
            executionTimeMs: r?.timeMs || 10,
            memoryKb: 3072,
            error: r?.error || undefined,
            isHidden: tc.isHidden,
          });
        }

        resolve({
          status: passedCount === testCases.length ? "passed" : "failed",
          passedTests: passedCount,
          totalTests: testCases.length,
          testResults: singleResults,
          totalExecutionTimeMs: totalExecTime,
          peakMemoryKb: 3072,
        });
      } catch (err) {
        resolve({
          status: "runtime_error",
          passedTests: 0,
          totalTests: testCases.length,
          testResults: testCases.map((tc, idx) => ({
            testCaseIndex: idx,
            passed: false,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: stdout || stderr,
            stdout,
            stderr,
            executionTimeMs: totalExecTime,
            memoryKb: 2048,
            error: stderr || "Failed to parse test outputs",
            isHidden: tc.isHidden,
          })),
          totalExecutionTimeMs: totalExecTime,
          peakMemoryKb: 2048,
        });
      }
    });
  });
}
