import Router from 'express';
import {authController} from '../controllers/authController';

const router=Router();
const auth_Controller=new authController()
router.post('/signup-pass',(req,res,next)=>auth_Controller.Signup_Pass(req,res,next))
export default router;
