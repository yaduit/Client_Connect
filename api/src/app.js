import express from 'express'
import cors from 'cors'
import authRoutes from './modules/auth/auth.routes.js'
import categoryRoutes from './modules/categories/category.routes.js'
import serviceProviderRoutes from './modules/services/serviceProvider.routes.js'
import serviceRoutes from './modules/services/service.routes.js'
import searchRoutes from './modules/search/search.routes.js'
import bookingRoutes from './modules/booking/booking.routes.js'
import contactRequestRoutes from './modules/contactRequests/contactRequest.routes.js'
import reviewRoutes from './modules/reviews/review.routes.js'
import utilsRoutes from './modules/utils/utils.routes.js'
import adminRoutes from './modules/admin/admin.routes.js'
import cookieParser from 'cookie-parser'
import errorHandler from './middlewares/error.middleware.js'

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.get("/", function(req,res){
    res.send("Hello from Express server!");
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/providers', serviceProviderRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact-requests', contactRequestRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes)
app.use('/api/utils', utilsRoutes)

// ✅ Global Error Handler (must be last)
app.use(errorHandler);

export default app;