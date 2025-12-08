import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Helper function to get optional env variable with default
const getEnv = (key: string, defaultValue: string): string => {
  return process.env[key] || defaultValue;
};

// Helper function to get required env variable (validated by validateEnv)
const getRequiredEnv = (key: string): string => {
  const value = process.env[key];
  // validateEnv() should be called before accessing these
  // Using non-null assertion is safe after validation
  return value!;
};

export const env = {
  // Server Configuration
  PORT: parseInt(getEnv('PORT', '3000'), 10),
  NODE_ENV: getEnv('NODE_ENV', 'development') as 'development' | 'production' | 'test',

  // MongoDB Configuration
  MONGODB_URI: getEnv('MONGODB_URI', 'mongodb://localhost:27017/campus-helper'),

  // JWT Configuration
  JWT_SECRET: getEnv('JWT_SECRET', 'your-super-secret-jwt-key-change-in-production'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '1h'),

  // OpenAI Configuration
  OPENAI_API_KEY: getEnv('OPENAI_API_KEY', ''),

  // Gemini AI Configuration
  GEMINI_API_URL: getEnv(
    'GEMINI_API_URL',
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent'
  ),
  GEMINI_API_KEY: getEnv(
    'GEMINI_API_KEY',
    'AIzaSyB5utRz6cZ5CHv7fW4-aa0LjurupXgNNv4'
  ),

  // CORS Configuration
  CORS_ORIGIN: getEnv('CORS_ORIGIN', 'http://localhost:5173'),

  // File Upload Configuration
  MAX_FILE_SIZE: parseInt(getEnv('MAX_FILE_SIZE', '5242880'), 10), // 5MB default
  UPLOAD_PATH: getEnv('UPLOAD_PATH', './uploads'),

  // God User Configuration (for initial setup) - REQUIRED
  // Note: validateEnv() must be called before accessing these values
  GOD_USER_EMAIL: getRequiredEnv('GOD_USER_EMAIL'),
  GOD_USER_USERNAME: getRequiredEnv('GOD_USER_USERNAME'),
  GOD_USER_PASSWORD: getRequiredEnv('GOD_USER_PASSWORD'),
  GOD_USER_NAME: getEnv('GOD_USER_NAME', 'God Admin'),
};

// Validate required environment variables
export const validateEnv = (): void => {
  const required = [
    'MONGODB_URI',
    'JWT_SECRET',
    'GOD_USER_EMAIL',
    'GOD_USER_USERNAME',
    'GOD_USER_PASSWORD',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `❌ Error: Missing required environment variables: ${missing.join(', ')}`
    );
    console.error(
      '⚠️  Please set these variables in your .env file. See .env.example for reference.'
    );
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

