//Validate environment variables n startup - prevents the runtime errors
import joi from 'joi';

const envSchema = joi.object({
    NODE_ENV: joi.string()
        .valid('development', 'production', 'test').default('development'),


    PORT: joi.number().default(3000),
    
    MONGODB_URI: joi.string().uri().required().messages({
        'any.required': 'MONGODB_URI is a required environment variable',
        'string.uri': 'MONGODB_URI must be a valid URI',
    }),

    JWT_SECRET: joi.string()
        .min(32).required().messages({
        'any.required': 'JWT_SECRET is a required environment variable',
        'string.min': 'JWT_SECRET should be at least 32 characters long',
    }),

    FRONTEND_URL: joi.string().uri().default('http://localhost:5173'),

    MAX_FILE_SIZE: joi.number().positive().default(10485760), // 10MB

    MAX_FILES_PER_UPLOAD: joi.number().positive().max(10).default(5),

    UPLOAD_DIR: joi.string().default('uploads'),

    RATE_LIMIT_WINDOW: joi.number().positive().default(15 * 60 * 1000), // 15 minutes

    RATE_LIMIT_MAX: joi.number()
        .positive()
        .default(100), // 100 requests per window

    UPLOAD_RATE_LIMIT_MAX: joi.number()
        .positive()
        .default(20), // 20 upload requests per window
}).unknown(); // allow other env vars

const validateEnv = () => {
  const { error, value } = envSchema.validate(process.env);
  
  if (error) {
    console.error('❌ Environment validation failed:');
    console.error(error.details.map(detail => `  - ${detail.message}`).join('\n'));
    throw new Error(`Config validation error: ${error.message}`);
  }
  
  console.log('✅ Environment variables validated successfully');
  return value;
};

// Export validated config
const getConfig = () => {
  const validatedEnv = validateEnv();
  
  return {
    NODE_ENV: validatedEnv.NODE_ENV,
    PORT: validatedEnv.PORT,
    MONGODB_URI: validatedEnv.MONGODB_URI,
    JWT_SECRET: validatedEnv.JWT_SECRET,
    FRONTEND_URL: validatedEnv.FRONTEND_URL,
    FILE_LIMITS: {
      MAX_FILE_SIZE: validatedEnv.MAX_FILE_SIZE,
      MAX_FILES_PER_UPLOAD: validatedEnv.MAX_FILES_PER_UPLOAD,
      UPLOAD_DIR: validatedEnv.UPLOAD_DIR
    },
    RATE_LIMITS: {
      WINDOW_MS: validatedEnv.RATE_LIMIT_WINDOW,
      MAX_REQUESTS: validatedEnv.RATE_LIMIT_MAX,
      MAX_UPLOADS: validatedEnv.UPLOAD_RATE_LIMIT_MAX
    }
  };
};

export default { 
  validateEnv,
  getConfig 
};