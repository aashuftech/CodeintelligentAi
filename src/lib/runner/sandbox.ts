import { ExecutionRequest, ExecutionResult, SupportedLanguage } from "./types";
import { runJavaScript } from "./languages/javascript";
import { runTypeScript } from "./languages/typescript";
import { runPython } from "./languages/python";
import { runCpp } from "./languages/cpp";
import { runJava } from "./languages/java";
import { runGo } from "./languages/golang";

export async function executeCode(req: ExecutionRequest): Promise<ExecutionResult> {
  const language = req.language.toLowerCase() as SupportedLanguage;

  try {
    switch (language) {
      case "javascript":
        return await runJavaScript(req);
      case "typescript":
        return await runTypeScript(req);
      case "python":
        return await runPython(req);
      case "cpp":
        return await runCpp(req);
      case "java":
        return await runJava(req);
      case "go":
        return await runGo(req);
      default:
        throw new Error(`Unsupported programming language: ${req.language}`);
    }
  } catch (err: unknown) {
    const error = err as Error;
    return {
      status: "runtime_error",
      passedTests: 0,
      totalTests: req.testCases.length,
      testResults: req.testCases.map((tc, idx) => ({
        testCaseIndex: idx,
        passed: false,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: error.message || "Unknown execution error",
        stdout: "",
        stderr: error.message || "Unknown error",
        executionTimeMs: 0,
        memoryKb: 0,
        error: error.message,
        isHidden: tc.isHidden,
      })),
      totalExecutionTimeMs: 0,
      peakMemoryKb: 0,
      compilerError: error.message,
    };
  }
}
