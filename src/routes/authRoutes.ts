import Router from 'express';
import { AuthController } from '../controllers/authController';

const router=Router();
const auth=new AuthController()
router.post('/signup',(req,res,next)=>auth.signup(req,res,next))
router.post('/verify',(req,res,next)=>auth.verify(req,res,next))
router.post('/confirm',(req,res,next)=>auth.confirm(req,res,next))
export default router;
