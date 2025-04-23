import 'dotenv/config';

export default {
  name: "OnlyFitnessApp",
  slug: "OnlyFitnessApp",
  version: "1.0.0",
  orientation: "portrait",
  platforms: [
    "ios",
    "android",
    "web"
  ],
  assetBundlePatterns: [
    "**/*"
  ],
  sdkVersion: "52.0.0",
  newArchEnabled: true,
  ios: {
    supportsTablet: true
  },
  android: {},
  web: {},
  extra: {
    // Expose environment variables here - these override the .env file in dev
    supabaseUrl: process.env.SUPABASE_URL || "https://bsvybpdqcggdfvffcjmf.supabase.co",
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzdnlicGRxY2dnZGZ2ZmZjam1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNzgzNzEsImV4cCI6MjA2MDk1NDM3MX0.jl4cgoKZ8ySkAhQWhz3Rpctw8zV7qK84Se3JF3WBrHQ"
  }
}; 