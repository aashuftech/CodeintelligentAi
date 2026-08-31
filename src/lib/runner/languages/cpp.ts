import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { ExecutionRequest, ExecutionResult, SingleTestResult } from "../types";

export async function runCpp(req: ExecutionRequest): Promise<ExecutionResult> {
  const { code, testCases, timeLimitMs = 5000 } = req;
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "cpp_sandbox_"));
  const sourcePath = path.join(tempDir, "solution.cpp");
  const binPath = path.join(tempDir, process.platform === "win32" ? "solution.exe" : "solution");

  // Check if user code includes standard headers
  const headerIncludes = `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>
#include <map>
#include <set>
#include <unordered_map>
#include <unordered_set>
#include <queue>
#include <stack>
#include <cmath>
using namespace std;
`;

  const fullCode = code.includes("#include") ? code : `${headerIncludes}\n${code}`;
  await fs.writeFile(sourcePath, fullCode, "utf-8");

  return new Promise<ExecutionResult>((resolve) => {
    // Compile step
    const compile = spawn("g++", ["-O2", "-std=c++20", sourcePath, "-o", binPath]);
    let compileErr = "";

    compile.stderr.on("data", (d) => {
      compileErr += d.toString();
    });

    compile.on("error", () => {
      // If g++ is not locally installed on the host OS, provide clear diagnostic message
      resolve({
        status: "compilation_error",
        passedTests: 0,
        totalTests: testCases.length,
        testResults: testCases.map((tc, idx) => ({
          testCaseIndex: idx,
          passed: false,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: "g++ compiler not found in local environment. Use Docker runner for full C++ compilation.",
          stdout: "",
          stderr: "g++ not found",
          executionTimeMs: 0,
          memoryKb: 0,
          error: "Compiler not installed locally",
          isHidden: tc.isHidden,
        })),
        totalExecutionTimeMs: 0,
        peakMemoryKb: 0,
        compilerError: "g++ compiler not found. Please run within Docker sandbox container.",
      });
    });

    compile.on("close", async (compileCode) => {
      if (compileCode !== 0) {
        try {
          await fs.rm(tempDir, { recursive: true, force: true });
        } catch {}
        return resolve({
          status: "compilation_error",
          passedTests: 0,
          totalTests: testCases.length,
          testResults: testCases.map((tc, idx) => ({
            testCaseIndex: idx,
            passed: false,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: compileErr,
            stdout: "",
            stderr: compileErr,
            executionTimeMs: 0,
            memoryKb: 0,
            error: compileErr,
            isHidden: tc.isHidden,
          })),
          totalExecutionTimeMs: 0,
          peakMemoryKb: 0,
          compilerError: compileErr,
        });
      }

      // Execute binary per test case
      const testResults: SingleTestResult[] = [];
      let totalTime = 0;

      for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i];
        const start = performance.now();

        const execPromise = new Promise<{ out: string; err: string; timedOut: boolean }>((res) => {
          const run = spawn(binPath, []);
          let out = "";
          let err = "";
          let timedOut = false;

          const timer = setTimeout(() => {
            timedOut = true;
            run.kill("SIGKILL");
          }, timeLimitMs);

          run.stdin.write(tc.input + "\n");
          run.stdin.end();

          run.stdout.on("data", (d) => (out += d.toString()));
          run.stderr.on("data", (d) => (err += d.toString()));

          run.on("close", () => {
            clearTimeout(timer);
            res({ out, err, timedOut });
          });
        });

        const { out, err, timedOut } = await execPromise;
        const execTime = Math.round((performance.now() - start) * 100) / 100;
        totalTime += execTime;

        const actual = out.trim();
        const passed = !timedOut && (actual === tc.expectedOutput.trim());

        testResults.push({
          testCaseIndex: i,
          passed,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: timedOut ? `Time Limit Exceeded (${timeLimitMs}ms)` : actual,
          stdout: out,
          stderr: err,
          executionTimeMs: execTime,
          memoryKb: 1024,
          error: timedOut ? "Time Limit Exceeded" : undefined,
          isHidden: tc.isHidden,
        });
      }

      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch {}

      const passedCount = testResults.filter((t) => t.passed).length;
      resolve({
        status: passedCount === testCases.length ? "passed" : "failed",
        passedTests: passedCount,
        totalTests: testCases.length,
        testResults,
        totalExecutionTimeMs: totalTime,
        peakMemoryKb: 2048,
      });
    });
  });
}
