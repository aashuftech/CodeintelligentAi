import { ExecutionRequest, ExecutionResult } from "../types";
import { runJavaScript } from "./javascript";
import ts from "typescript";

/**
 * Transpiles TypeScript source code to JavaScript
 */
function transpileTypeScript(tsCode: string): string {
  try {
    const result = ts.transpileModule(tsCode, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        removeComments: false,
      },
    });
    return result.outputText;
  } catch {
    // Fallback regex stripper
    return tsCode
      .replace(/interface\s+\w+\s*\{[\s\S]*?\}/g, "")
      .replace(/type\s+\w+\s*=\s*[\s\S]*?;/g, "")
      .replace(/:\s*([A-Za-z0-9_<>[\]|&?]+(\s*\|\s*[A-Za-z0-9_<>[\]|&?]+)*)/g, "")
      .replace(/<[A-Za-z0-9_,\s<>]+>/g, "")
      .replace(/!/g, "");
  }
}

export async function runTypeScript(req: ExecutionRequest): Promise<ExecutionResult> {
  const jsCode = transpileTypeScript(req.code);
  return runJavaScript({
    ...req,
    code: jsCode,
  });
}
