import { v2 as cloudinary } from 'cloudinary';

const required = ['CLOUDINARY_CLOUD_NAME','CLOUDINARY_API_KEY','CLOUDINARY_API_SECRET'];
const missing = required.filter(k => !process.env[k]);

if (missing.length > 0) {
  console.warn(`⚠️  WARNING: Cloudinary NOT fully configured.`);
  console.warn(`   Missing environment variables: ${missing.join(', ')}`);
  console.warn(`   Image uploads will FAIL until these are configured.`);
  console.warn(`   Please add to your .env file:`);
  missing.forEach(v => console.warn(`   ${v}=your_value`));
} else {
  // ✅ Configure cloudinary only if all credentials are present
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    console.log('✅ Cloudinary configured successfully');
  } catch (err) {
    console.error('❌ Failed to configure Cloudinary:', err.message);
  }
}

export default cloudinary;