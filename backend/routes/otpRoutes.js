import express from 'express';
import { otpValidator } from '../validators/otpValidators.js';

const router = express.Router();

router.post('/', otpValidator);

export default router;