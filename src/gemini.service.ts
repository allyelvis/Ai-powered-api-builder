import { Injectable, signal } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { Model, Endpoint } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private genAI: GoogleGenAI | null = null;
  
  constructor() {
    // IMPORTANT: This check is for the Applet environment where process.env is available.
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      this.genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
    } else {
      console.error('API_KEY environment variable not found.');
    }
  }

  async generateServerCode(models: Model[], endpoints: Endpoint[]): Promise<string> {
    if (!this.genAI) {
      return Promise.reject('Gemini AI client is not initialized. Check API_KEY.');
    }

    const modelPrompt = models.map(m => 
        `- Model: ${m.name}\n  Fields: ${m.fields.map(f => `${f.name}: ${f.type}`).join(', ')}`
    ).join('\n');

    const endpointPrompt = endpoints.map(e =>
        `- Method: ${e.method}\n  Path: ${e.path}\n  Description: ${e.description}`
    ).join('\n\n');

    const fullPrompt = `
      You are an expert backend engineer specializing in Node.js and Express.js.
      Your task is to generate a single, complete, and runnable \`server.js\` file.
      The server must use Express.js and manage data in-memory using simple JavaScript arrays.
      Do NOT include a package.json file, installation instructions, markdown formatting, or any text other than the pure JavaScript code for \`server.js\`.

      Data Models:
      ${modelPrompt}

      API Endpoints:
      ${endpointPrompt}

      Requirements:
      1. Initialize an Express app.
      2. For each model, create an in-memory array to store the data (e.g., \`let users = [];\`).
      3. Implement all the specified API endpoints.
      4. Include body parsing for POST/PUT requests: \`app.use(express.json());\`.
      5. For creating new items, generate a simple unique ID (e.g., using a counter or Date.now()).
      6. Return appropriate JSON responses with correct status codes (200, 201, 204, 404, 400).
      7. Start the server on port 3000 and log a confirmation message.
      8. The entire output must be a single block of valid JavaScript code, starting with \`const express = require('express');\`.
    `;

    try {
        const response = await this.genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
        });
        return response.text;
    } catch (error) {
        console.error('Error generating code:', error);
        return Promise.reject('Failed to generate code from Gemini API.');
    }
  }
}
