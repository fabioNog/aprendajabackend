export default () => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  environment: process.env.NODE_ENV || 'development',
  
  // Email (para depois)
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
});