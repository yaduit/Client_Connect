import express from 'express'
import cors from 'cors'
import authRoutes from './modules/auth/auth.routes.js'
import categoryRoutes from './modules/categories/category.routes.js'
import serviceProviderRoutes from './modules/services/serviceProvider.routes.js'
import searchRoutes from './modules/search/search.routes.js'
import bookingRoutes from './modules/booking/booking.routes.js'
import contactRequestRoutes from './modules/contactRequests/contactRequest.routes.js'
import cookieParser from 'cookie-parser'
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
app.use('/api/search', searchRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact-request', contactRequestRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;