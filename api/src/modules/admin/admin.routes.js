import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllProviders,
  updateProviderStatus,
  deleteProvider,
  getAllBookings,
  getAllCategories,
  updateCategory,
  deleteCategory,
  updateSubCategory,
  deleteSubCategory
} from './admin.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import roleMiddleware from '../../middlewares/role.middleware.js';

const router = express.Router();

// All routes require admin role
router.use(authMiddleware, roleMiddleware('admin'));

// ============ DASHBOARD ============
router.get('/stats', getDashboardStats);

// ============ USER MANAGEMENT ============
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// ============ PROVIDER MANAGEMENT ============
router.get('/providers', getAllProviders);
router.patch('/providers/:id/status', updateProviderStatus);
router.delete('/providers/:id', deleteProvider);

// ============ BOOKING MANAGEMENT ============
router.get('/bookings', getAllBookings);

// ============ CATEGORY MANAGEMENT ============
router.get('/categories', getAllCategories);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);
router.put('/categories/:categoryId/subcategories/:subId', updateSubCategory);
router.delete('/categories/:categoryId/subcategories/:subId', deleteSubCategory);

export default router;