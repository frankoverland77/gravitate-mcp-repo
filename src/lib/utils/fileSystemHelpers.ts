// Enhanced file system utilities with user prompts
// src/lib/utils/fileSystemHelpers.ts

import * as fs from "fs/promises";
import * as path from "path";
import {
  validateDirectoryPath,
  createFileLocationMessage,
  suggestDirectory,
} from "./userPrompts.js";

export interface FileGenerationOptions {
  outputDirectory: string;
  projectName: string;
  operation: string;
}

export interface FileToWrite {
  type: string;
  text: string;
  name?: string; // Optional filename override
}

/**
 * Enhanced file writing function that uses user-specified directory
 */
export async function writeProjectToUserDirectory(
  options: FileGenerationOptions,
  files: FileToWrite[]
): Promise<{
  projectPath: string;
  filesWritten: string[];
  message: string;
}> {
  const { outputDirectory, projectName, operation } = options;

  // Validate directory path
  const validation = validateDirectoryPath(outputDirectory);
  if (!validation.isValid) {
    throw new Error(`Invalid directory path: ${validation.error}`);
  }

  const projectDir = path.join(validation.normalizedPath, `${projectName}Demo`);

  console.error(`🏗️  Creating ${operation} at: ${projectDir}`);
  console.error(`📁 User-specified directory: ${outputDirectory}`);

  try {
    // Create project directory
    await fs.mkdir(projectDir, { recursive: true });
    console.error(`📂 Project directory created: ${projectDir}`);

    const filesWritten: string[] = [];

    // Write each file
    for (const file of files) {
      let fileName: string;
      let fileContent: string;

      if (file.name) {
        // Direct file with name specified
        fileName = file.name;
        fileContent = file.text;
      } else {
        // Parse markdown-style file format
        const fileMatch = file.text.match(
          /\*\*(.*?)\*\*\n```(?:\w+)?\n([\s\S]*?)\n```/
        );
        if (!fileMatch) {
          console.error(`⚠️  Skipping file with invalid format`);
          continue;
        }
        fileName = fileMatch[1];
        fileContent = fileMatch[2];
      }

      const filePath = path.join(projectDir, fileName);
      const fileDir = path.dirname(filePath);

      await fs.mkdir(fileDir, { recursive: true });

      await fs.writeFile(filePath, fileContent, "utf-8");
      filesWritten.push(fileName);
      console.error(`✅ Written: ${fileName}`);
    }

    console.error(`🎉 Successfully created ${filesWritten.length} files`);

    const message = createFileLocationMessage(
      projectDir,
      filesWritten,
      operation
    );

    return {
      projectPath: projectDir,
      filesWritten,
      message,
    };
  } catch (error) {
    console.error(`❌ Error creating ${operation}: ${error}`);
    throw new Error(`Failed to create ${operation}: ${error}`);
  }
}

/**
 * Write files directly to a directory (not in a project subdirectory)
 */
export async function writeFilesToUserDirectory(
  outputDirectory: string,
  files: FileToWrite[],
  operation: string
): Promise<{
  filesWritten: string[];
  message: string;
}> {
  // Validate directory path
  const validation = validateDirectoryPath(outputDirectory);
  if (!validation.isValid) {
    throw new Error(`Invalid directory path: ${validation.error}`);
  }

  const targetDir = validation.normalizedPath;

  console.error(`🏗️  Writing ${operation} files to: ${targetDir}`);

  try {
    // Ensure directory exists
    await fs.mkdir(targetDir, { recursive: true });

    const filesWritten: string[] = [];

    for (const file of files) {
      let fileName: string;
      let fileContent: string;

      if (file.name) {
        fileName = file.name;
        fileContent = file.text;
      } else {
        const fileMatch = file.text.match(
          /\*\*(.*?)\*\*\n```(?:\w+)?\n([\s\S]*?)\n```/
        );
        if (!fileMatch) {
          console.error(`⚠️  Skipping file with invalid format`);
          continue;
        }
        fileName = fileMatch[1];
        fileContent = fileMatch[2];
      }

      const filePath = path.join(targetDir, fileName);
      const fileDir = path.dirname(filePath);

      await fs.mkdir(fileDir, { recursive: true });
      await fs.writeFile(filePath, fileContent, "utf-8");
      filesWritten.push(fileName);
      console.error(`✅ Written: ${fileName}`);
    }

    const message = createFileLocationMessage(
      targetDir,
      filesWritten,
      operation
    );

    return {
      filesWritten,
      message,
    };
  } catch (error) {
    console.error(`❌ Error writing ${operation} files: ${error}`);
    throw new Error(`Failed to write ${operation} files: ${error}`);
  }
}

/**
 * Create a test file to verify directory access
 */
export async function testDirectoryAccess(
  outputDirectory: string
): Promise<{ success: boolean; message: string }> {
  try {
    const validation = validateDirectoryPath(outputDirectory);
    if (!validation.isValid) {
      return {
        success: false,
        message: `Invalid path: ${validation.error}`,
      };
    }

    const testPath = path.join(
      validation.normalizedPath,
      `test-${Date.now()}.tmp`
    );

    // Try to create the directory if it doesn't exist
    await fs.mkdir(validation.normalizedPath, { recursive: true });

    // Try to write a test file
    await fs.writeFile(testPath, "test", "utf-8");

    // Try to read it back
    await fs.readFile(testPath, "utf-8");

    // Clean up
    await fs.unlink(testPath);

    return {
      success: true,
      message: `✅ Directory is writable: ${validation.normalizedPath}`,
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ Cannot write to directory: ${error}`,
    };
  }
}

/**
 * Check if directory exists and list contents
 */
export async function inspectDirectory(
  dirPath: string
): Promise<{ exists: boolean; contents?: string[]; message: string }> {
  try {
    const validation = validateDirectoryPath(dirPath);
    if (!validation.isValid) {
      return {
        exists: false,
        message: `Invalid path: ${validation.error}`,
      };
    }

    const contents = await fs.readdir(validation.normalizedPath);
    return {
      exists: true,
      contents,
      message: `📁 Directory exists with ${contents.length} items`,
    };
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return {
        exists: false,
        message: `📁 Directory does not exist (will be created)`,
      };
    }
    return {
      exists: false,
      message: `❌ Error accessing directory: ${error.message}`,
    };
  }
}
