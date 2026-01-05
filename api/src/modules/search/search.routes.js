import express from 'express'
import { searchProviders } from './search.controller.js'

const router = express.Router()

router.get('/providers', searchProviders);

export default router;
