import express from 'express';  
import { submitInquiryCharDham } from '../controllers/chardhamyatraController.js';

const router = express.Router();

router.post('/chardham', submitInquiryCharDham); 

export default router;