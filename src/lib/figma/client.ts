// Figma API client
// src/lib/figma/client.ts

import axios from 'axios';
import type { FigmaFile, FigmaNode } from './types.js';

export class FigmaClient {
  private apiToken: string;
  private baseUrl = 'https://api.figma.com/v1';

  constructor(apiToken: string) {
    this.apiToken = apiToken;
  }

  private getHeaders() {
    return {
      'X-Figma-Token': this.apiToken,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get a Figma file by file key
   */
  async getFile(fileKey: string): Promise<FigmaFile> {
    try {
      const response = await axios.get(`${this.baseUrl}/files/${fileKey}`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch Figma file: ${error}`);
    }
  }

  /**
   * Get specific nodes from a Figma file
   */
  async getNodes(fileKey: string, nodeIds: string[]): Promise<{ nodes: Record<string, FigmaNode> }> {
    try {
      const ids = nodeIds.join(',');
      const response = await axios.get(`${this.baseUrl}/files/${fileKey}/nodes`, {
        params: { ids },
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch Figma nodes: ${error}`);
    }
  }

  /**
   * Get images for specific nodes
   */
  async getImages(fileKey: string, nodeIds: string[], format: 'png' | 'jpg' | 'svg' = 'png'): Promise<{ images: Record<string, string> }> {
    try {
      const ids = nodeIds.join(',');
      const response = await axios.get(`${this.baseUrl}/images/${fileKey}`, {
        params: { ids, format },
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch Figma images: ${error}`);
    }
  }

  /**
   * Get team projects
   */
  async getTeamProjects(teamId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/teams/${teamId}/projects`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch team projects: ${error}`);
    }
  }

  /**
   * Get project files
   */
  async getProjectFiles(projectId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/projects/${projectId}/files`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch project files: ${error}`);
    }
  }

  /**
   * Extract file key from Figma URL
   */
  static extractFileKey(figmaUrl: string): string | null {
    const regex = /figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/;
    const match = figmaUrl.match(regex);
    return match ? match[1] : null;
  }

  /**
   * Extract node ID from Figma URL
   */
  static extractNodeId(figmaUrl: string): string | null {
    const regex = /node-id=([0-9]+-[0-9]+)/;
    const match = figmaUrl.match(regex);
    return match ? match[1].replace('-', ':') : null;
  }

  /**
   * Validate if API token works
   */
  async validateToken(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/me`, {
        headers: this.getHeaders(),
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }
}
