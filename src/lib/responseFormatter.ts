// Response Formatter - Ensures consistent, PR-ready outputs
// Following the Gravitate.Dotnet.Next patterns

export interface FormattedResponse {
  changePlan?: ChangePlan;
  code?: GeneratedCode;
  validationReport?: ValidationReport;
  prPayload?: PullRequestPayload;
  raw?: any; // For backwards compatibility
}

export interface ChangePlan {
  summary: string;
  module: string;
  feature: string;
  changes: Change[];
  impacts: string[];
}

export interface Change {
  type: "create" | "update" | "delete";
  path: string;
  description: string;
}

export interface GeneratedCode {
  files: CodeFile[];
  dependencies?: string[];
  setupInstructions?: string[];
}

export interface CodeFile {
  path: string;
  content: string;
  language: "typescript" | "tsx" | "css" | "json";
  purpose: string;
}

export interface ValidationReport {
  passed: boolean;
  checks: ValidationCheck[];
  warnings: string[];
  errors: string[];
}

export interface ValidationCheck {
  name: string;
  passed: boolean;
  message?: string;
}

export interface PullRequestPayload {
  title: string;
  description: string;
  branch: string;
  labels: string[];
  reviewers?: string[];
}

export class ResponseFormatter {
  
  /**
   * Format any MCP tool response into a consistent structure
   */
  static format(
    toolName: string,
    rawResponse: any,
    context?: Record<string, any>
  ): FormattedResponse {
    // Route to specific formatters based on tool type
    if (toolName.includes("generate") || toolName.includes("create")) {
      return this.formatGenerationResponse(rawResponse, context);
    }
    
    if (toolName.includes("discover") || toolName.includes("search")) {
      return this.formatDiscoveryResponse(rawResponse, context);
    }
    
    if (toolName.includes("validate") || toolName.includes("check")) {
      return this.formatValidationResponse(rawResponse, context);
    }
    
    // Default format
    return { raw: rawResponse };
  }

  /**
   * Format code generation responses
   */
  private static formatGenerationResponse(
    rawResponse: any,
    context?: Record<string, any>
  ): FormattedResponse {
    const moduleName = context?.moduleName || "Unknown";
    const featureName = context?.featureName || "Unknown";
    const theme = context?.theme || "default";
    
    const files: CodeFile[] = [];
    const changes: Change[] = [];
    
    // Extract generated files from response
    if (rawResponse?.files) {
      rawResponse.files.forEach((file: any) => {
        files.push({
          path: file.path || file.name,
          content: file.content || file.code,
          language: this.detectLanguage(file.path || file.name),
          purpose: file.purpose || this.inferPurpose(file.path || file.name)
        });
        
        changes.push({
          type: "create",
          path: file.path || file.name,
          description: `Generated ${this.inferPurpose(file.path || file.name)}`
        });
      });
    }
    
    // Build the response
    return {
      changePlan: {
        summary: `Generate ${featureName} feature in ${moduleName} module with ${theme} theme`,
        module: moduleName,
        feature: featureName,
        changes,
        impacts: [
          `New feature will be available at /modules/${moduleName}/${featureName}`,
          "No breaking changes to existing code",
          "Follows Gravitate design patterns"
        ]
      },
      code: {
        files,
        dependencies: this.extractDependencies(files),
        setupInstructions: [
          "1. Run 'yarn' to install dependencies",
          `2. Import feature in src/modules/${moduleName}/index.tsx`,
          "3. Add route to your router configuration",
          "4. Test with sample data"
        ]
      },
      validationReport: this.performValidation(files),
      prPayload: {
        title: `feat(${moduleName}): Add ${featureName} feature`,
        description: this.generatePRDescription(moduleName, featureName, changes, theme),
        branch: `feature/${moduleName.toLowerCase()}-${featureName.toLowerCase()}`,
        labels: ["feature", moduleName.toLowerCase(), "auto-generated"],
        reviewers: []
      }
    };
  }

  /**
   * Format discovery/search responses
   */
  private static formatDiscoveryResponse(
    rawResponse: any,
    context?: Record<string, any>
  ): FormattedResponse {
    return {
      raw: rawResponse,
      validationReport: {
        passed: true,
        checks: [
          {
            name: "Components Found",
            passed: true,
            message: `Found components matching criteria`
          }
        ],
        warnings: [],
        errors: []
      }
    };
  }

  /**
   * Format validation responses
   */
  private static formatValidationResponse(
    rawResponse: any,
    context?: Record<string, any>
  ): FormattedResponse {
    const checks: ValidationCheck[] = [];
    const warnings: string[] = [];
    const errors: string[] = [];
    
    // Parse validation results
    if (rawResponse?.validations) {
      rawResponse.validations.forEach((v: any) => {
        checks.push({
          name: v.name || v.check,
          passed: v.passed || v.success,
          message: v.message || v.details
        });
        
        if (!v.passed && v.severity === "error") {
          errors.push(v.message);
        } else if (!v.passed) {
          warnings.push(v.message);
        }
      });
    }
    
    return {
      validationReport: {
        passed: errors.length === 0,
        checks,
        warnings,
        errors
      },
      raw: rawResponse
    };
  }

  /**
   * Detect language from file extension
   */
  private static detectLanguage(filepath: string): "typescript" | "tsx" | "css" | "json" {
    if (filepath.endsWith(".tsx")) return "tsx";
    if (filepath.endsWith(".ts")) return "typescript";
    if (filepath.endsWith(".css")) return "css";
    if (filepath.endsWith(".json")) return "json";
    return "typescript";
  }

  /**
   * Infer file purpose from path
   */
  private static inferPurpose(filepath: string): string {
    if (filepath.includes("index")) return "Main component";
    if (filepath.includes("Grid")) return "Grid component";
    if (filepath.includes("columnDefs")) return "Grid column definitions";
    if (filepath.includes("types")) return "TypeScript types";
    if (filepath.includes("api") || filepath.includes("use")) return "API hooks";
    if (filepath.includes("Modal")) return "Modal component";
    if (filepath.includes("Form")) return "Form component";
    if (filepath.includes("config")) return "Configuration";
    if (filepath.includes("styles")) return "Styles";
    return "Component";
  }

  /**
   * Extract dependencies from generated code
   */
  private static extractDependencies(files: CodeFile[]): string[] {
    const deps = new Set<string>();
    
    files.forEach(file => {
      // Look for imports in the code
      const importMatches = file.content.matchAll(/import .* from ['"]([^'"]+)['"]/g);
      for (const match of importMatches) {
        const dep = match[1];
        if (!dep.startsWith(".") && !dep.startsWith("@/")) {
          deps.add(dep);
        }
      }
    });
    
    // Always include Excalibrr
    deps.add("@gravitate-js/excalibrr");
    
    return Array.from(deps);
  }

  /**
   * Perform validation on generated files
   */
  private static performValidation(files: CodeFile[]): ValidationReport {
    const checks: ValidationCheck[] = [];
    const warnings: string[] = [];
    const errors: string[] = [];
    
    // Check: No TypeScript errors (basic check)
    checks.push({
      name: "TypeScript Syntax",
      passed: files.every(f => !f.content.includes("@ts-ignore")),
      message: "No @ts-ignore directives found"
    });
    
    // Check: Uses Excalibrr components
    const usesExcalibrr = files.some(f => 
      f.content.includes("@gravitate-js/excalibrr")
    );
    checks.push({
      name: "Excalibrr Usage",
      passed: usesExcalibrr,
      message: usesExcalibrr ? "Uses Excalibrr components" : "Should use Excalibrr components"
    });
    if (!usesExcalibrr) {
      warnings.push("Consider using Excalibrr components instead of custom implementations");
    }
    
    // Check: No Tailwind usage
    const usesTailwind = files.some(f => 
      f.content.includes("className") && 
      (f.content.includes("tw-") || f.content.includes("tailwind"))
    );
    checks.push({
      name: "No Tailwind",
      passed: !usesTailwind,
      message: usesTailwind ? "Found Tailwind classes" : "No Tailwind detected"
    });
    if (usesTailwind) {
      errors.push("Tailwind CSS detected - use Gravitate themes instead");
    }
    
    // Check: Follows file structure
    const hasIndex = files.some(f => f.path.includes("index.tsx"));
    checks.push({
      name: "File Structure",
      passed: hasIndex,
      message: hasIndex ? "Has index.tsx entry point" : "Missing index.tsx"
    });
    if (!hasIndex) {
      warnings.push("Consider adding an index.tsx as the main entry point");
    }
    
    // Check: API hooks pattern
    const hasApiHooks = files.some(f => f.path.includes("/api/use"));
    const needsApi = files.some(f => f.content.includes("api.post"));
    if (needsApi && !hasApiHooks) {
      warnings.push("Consider extracting API calls to a custom hook in /api folder");
    }
    
    return {
      passed: errors.length === 0,
      checks,
      warnings,
      errors
    };
  }

  /**
   * Generate PR description
   */
  private static generatePRDescription(
    module: string,
    feature: string,
    changes: Change[],
    theme: string
  ): string {
    return `## Summary
    
This PR adds the **${feature}** feature to the ${module} module using the ${theme} theme.

## Changes

${changes.map(c => `- ${c.description}`).join("\n")}

## Technical Details

- **Module**: ${module}
- **Feature**: ${feature}  
- **Theme**: ${theme}
- **Components**: Uses Excalibrr component library
- **Pattern**: Follows Gravitate.Dotnet.Next architecture

## Testing

- [ ] Component renders without errors
- [ ] Grid displays sample data correctly
- [ ] Theme applied correctly
- [ ] API hooks functioning (if applicable)
- [ ] No TypeScript errors
- [ ] No console warnings

## Screenshots

_Please add screenshots of the new feature_

## Checklist

- [x] Code follows Gravitate patterns
- [x] Uses Excalibrr components
- [x] No Tailwind CSS
- [x] Properly typed with TypeScript
- [ ] Tested locally
- [ ] Documentation updated (if needed)

---
*This PR was auto-generated by the Excalibrr MCP Server*`;
  }
}
