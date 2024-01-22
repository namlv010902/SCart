import { Router } from 'express';
import { sendMailer } from '../controller/sendMailer';

const router = Router();
router.post('/sendMailer',sendMailer);

export default router;