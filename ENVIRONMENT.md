# Environment Variables Setup

This project uses environment variables to manage configuration settings, especially for external services like Supabase.

## Required Environment Variables

The following environment variables are required for the application to function correctly:

- `SUPABASE_URL`: Your Supabase project URL (e.g., https://your-project.supabase.co)
- `SUPABASE_ANON_KEY`: Your Supabase project's anonymous/public key

## Setup Instructions

1. Copy the `.env.example` file to a new file named `.env`:
   ```
   cp .env.example .env
   ```

2. Edit the `.env` file and replace the placeholder values with your actual configuration:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-actual-anon-key
   ```

3. The `.env` file should never be committed to version control, as it contains sensitive information. It's already included in `.gitignore`.

## Finding Your Supabase Credentials

1. Log in to your [Supabase Dashboard](https://app.supabase.io/)
2. Select your project
3. Go to Project Settings > API
4. Under "Project URL", you'll find your Supabase URL
5. Under "Project API keys", you'll find your anon/public key

## Accessing Environment Variables in Code

In this project, we access environment variables using the `@env` module, which is configured via the `react-native-dotenv` package.

Example usage:

```javascript
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

console.log(SUPABASE_URL); // Outputs your Supabase URL
``` 