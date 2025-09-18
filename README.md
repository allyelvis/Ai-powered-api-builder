# Rest API Server Side Builder

This application provides an intuitive interface for designing a REST API. Users can define data models and API endpoints, and then leverage the power of the Google Gemini API to automatically generate the complete server-side code in Node.js and Express.

## Features

- **Model Definition**: Create custom data models with strongly-typed fields (string, number, boolean).
- **Endpoint Specification**: Define API endpoints with standard HTTP methods (GET, POST, PUT, DELETE) and clear descriptions.
- **Full CRUD Functionality**: Easily add, view, edit, and delete models and endpoints directly within the UI.
- **Advanced Code Generation**:
    - **AI-Powered**: Utilizes the Gemini API to generate a complete, runnable `server.js` file.
    - **Database Option**: Choose to generate code with Mongoose schemas for MongoDB integration.
    - **Authentication Option**: Add basic API key authentication middleware to protect your endpoints.
- **In-Memory or DB**: The generated server can use simple in-memory arrays or a full database, making it flexible for testing or production.
- **Interactive UI**: A clean and modern interface built with Angular and styled with Tailwind CSS.
- **Code Viewer**: Displays the generated code with a one-click "copy to clipboard" feature.

## How to Use

1.  **Define Your Models**:
    - Click the **"Add Model"** button.
    - Enter a name for your model (e.g., `Product`, `User`).
    - Add fields to your model, specifying a name and a data type for each (e.g., `name: string`, `price: number`).
    - Click **"Save Model"**.

2.  **Define Your Endpoints**:
    - Click the **"Add Endpoint"** button.
    - Select an HTTP method (e.g., `GET`, `POST`).
    - Specify the URL path (e.g., `/products`, `/products/:id`).
    - Write a brief description of the endpoint's purpose (e.g., "Get all products").
    - Click **"Save Endpoint"**.

3.  **Edit or Delete**:
    - To edit an existing item, simply click on it in the list. The form will pre-populate with its data, allowing you to make changes.
    - To delete an item, click the `×` icon next to it.

4.  **Select Generation Options (Optional)**:
    - Before generating, you can choose to enhance your server with additional features:
    - **Database Integration**: Check this box to generate code that uses Mongoose to connect to a MongoDB database for data persistence instead of temporary in-memory arrays.
    - **Basic Authentication**: Check this box to add a simple middleware that protects all your API endpoints, requiring a valid API key to be sent in the `Authorization` header.

5.  **Generate the Code**:
    - Once you have defined at least one model and one endpoint, the **"Generate Server Code"** button will become active.
    - Click it to send your API schema to the Gemini API.

6.  **View and Run**:
    - The generated Node.js/Express code will appear in the code viewer on the right.
    - Click the **"Copy"** button to copy the code to your clipboard.
    - Paste the code into a file named `server.js`.
    - Install dependencies: `npm install express` (and `npm install mongoose` if you selected the database option).
    - Set up your `.env` file for `MONGODB_URI` and/or `API_SECRET_KEY` if needed.
    - Start your server with `node server.js`.

## Tech Stack

- **Frontend**: Angular (Standalone Components, Signals for state management)
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini API (`@google/genai`)
- **Language**: TypeScript

## Setup

For the application to function, you must have a Google Gemini API key. The application is designed to read this key from a `process.env.API_KEY` environment variable.
