export type SupportedLanguage =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "cpp"
  | "go";

export interface ExecutionTestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
  isHidden?: boolean;
}

export interface ExecutionRequest {
  code: string;
  language: SupportedLanguage;
  testCases: ExecutionTestCase[];
  timeLimitMs?: number;
  memoryLimitMb?: number;
}

export interface SingleTestResult {
  testCaseIndex: number;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  memoryKb: number;
  error?: string;
  isHidden?: boolean;
}

export interface ExecutionResult {
  status: "passed" | "failed" | "compilation_error" | "runtime_error" | "timeout";
  passedTests: number;
  totalTests: number;
  testResults: SingleTestResult[];
  totalExecutionTimeMs: number;
  peakMemoryKb: number;
  compilerError?: string;
  rawOutput?: string;
}
