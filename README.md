# Nuxt Minimal Starter

This repository is a modern template for rapidly starting new projects with Nuxt and Supabase. It is designed to provide a solid foundation for building full-stack applications with seamless integration of AI features, including support for the OpenAI API.

Key features:

- Built with Nuxt for a powerful, flexible, and scalable frontend.
- Supabase integration for authentication, database, and backend services.
- Ready-to-use AI capabilities via the OpenAI API.
- Pre-configured with Tailwind CSS v4 and Nuxt UI components for fast, beautiful, and adaptive UI development.
- Follows best practices and a simple layered architecture for maintainability and scalability.

Use this template to kickstart your next AI-powered web application with minimal setup and maximum productivity.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# copy the env file
cp ./.env.example ./.env
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev
```

### MCP

MCP running automatically by starting dev server, then the MCP server will be available at `http://localhost:3000/__mcp/sse`.

When using VSCode, Cursor, Windsurf, the module will automatically update the config files for you.

## Production

Build the application for production:

```bash
# npm
npm run build
```

Locally preview production build:

```bash
# npm
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
