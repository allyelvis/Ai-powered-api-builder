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

  async generateServerCode(models: Model[], endpoints: Endpoint[], options: { useDatabase: boolean; useAuth: boolean; }): Promise<string> {
    if (!this.genAI) {
      return Promise.reject('Gemini AI client is not initialized. Check API_KEY.');
    }

    const { useDatabase, useAuth } = options;

    const modelPrompt = models.map(m => 
        `- Model: ${m.name}\n  Fields: ${m.fields.map(f => `${f.name}: ${f.type}`).join(', ')}`
    ).join('\n');

    const endpointPrompt = endpoints.map(e =>
        `- Method: ${e.method}\n  Path: ${e.path}\n  Description: ${e.description}`
    ).join('\n\n');

    let dataManagementInstructions = `The server must manage data in-memory using simple JavaScript arrays. For each model, create an in-memory array to store the data (e.g., \`let users = [];\`).`;

    if (useDatabase) {
      dataManagementInstructions = `The server must use Mongoose to connect to a MongoDB database.
1.  Include \`require('mongoose');\`
2.  Connect to MongoDB using an environment variable \`MONGODB_URI\`. Include boilerplate for the connection logic.
3.  For each model defined below, create a corresponding Mongoose Schema and Model. Map the field types (string, number, boolean) to Mongoose schema types (String, Number, Boolean).
4.  All endpoint handlers must use asynchronous Mongoose methods (e.g., \`Model.find()\`, \`Model.create()\`, etc.) to interact with the database. Use async/await syntax.`;
    }

    let authInstructions = '';
    if (useAuth) {
      authInstructions = `
Security Requirements:
1.  Implement a simple API key authentication middleware.
2.  The middleware should check for an \`Authorization\` header with a bearer token (e.g., \`Bearer YOUR_SECRET_KEY\`).
3.  The expected API key should be read from an environment variable \`API_SECRET_KEY\`.
4.  If the key is missing or incorrect, respond with a 401 Unauthorized status.
5.  Apply this middleware to all routes to protect all endpoints.
`;
    }

    const fullPrompt = `
      You are an expert backend engineer specializing in Node.js, Express.js, and MongoDB.
      Your task is to generate a single, complete, and runnable \`server.js\` file.
      The server must use Express.js.
      Do NOT include a package.json file, installation instructions, markdown formatting, or any text other than the pure JavaScript code for \`server.js\`.

      Data Models:
      ${modelPrompt}

      API Endpoints:
      ${endpointPrompt}

      Data Management Requirements:
      ${dataManagementInstructions}
      
      ${authInstructions}

      General Requirements:
      1.  Initialize an Express app.
      2.  Include body parsing for POST/PUT requests: \`app.use(express.json());\`.
      3.  For creating new items (when not using a database), generate a simple unique ID (e.g., using Date.now()). MongoDB will handle this automatically.
      4.  Return appropriate JSON responses with correct status codes (200, 201, 204, 401, 404, 400, 500).
      5.  When using a database, wrap database operations in try/catch blocks to handle potential errors and return a 500 status code on failure.
      6.  Start the server on port 3000 and log a confirmation message.
      7.  The entire output must be a single block of valid JavaScript code, starting with \`const express = require('express');\`.
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