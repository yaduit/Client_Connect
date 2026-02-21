import dotenv from 'dotenv';
import connectDB from './config/db.js';

// ✅ LOAD ENV IMMEDIATELY
dotenv.config();

// ✅ DYNAMIC IMPORT - app loads AFTER env is ready
const startServer = async () => {
  const { default: app } = await import('./app.js');
  
  connectDB();
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, function() {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
