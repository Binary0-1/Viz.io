# Structurify

Structurify is a web application that visualizes JSON data into interactive diagrams. It allows users to paste in a JSON object, which is then rendered as a graph using React Flow. This provides a clear and intuitive way to understand the structure of the JSON data.

## Features

- **JSON to Graph Visualization:** Automatically converts JSON objects into a node-based graph.
- **Resizable Sidebar:** A resizable sidebar for JSON input.
- **JSON Formatting:** A button to format the JSON input.
- **Interactive Diagram:** The generated diagram is interactive, allowing users to pan and zoom.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v20 or later)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/structurify.git
   ```
2. Navigate to the project directory:
   ```bash
   cd structurify
   ```
3. Install the dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

### Running the Development Server

To run the development server, execute the following command:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Built With

- [Next.js](https://nextjs.org/) - The React framework for production.
- [React Flow](https://reactflow.dev/) - A library for building node-based applications.
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework.
- [TypeScript](https://www.typescriptlang.org/) - A typed superset of JavaScript.