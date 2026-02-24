import express from 'express';
import { reverseGeocode, searchGeocode } from './utils.controller.js';

const router = express.Router();

// GET /api/utils/reverse?lat=..&lon=..
router.get('/reverse', reverseGeocode);
// GET /api/utils/search?q=...
router.get('/search', searchGeocode);

export default router;
