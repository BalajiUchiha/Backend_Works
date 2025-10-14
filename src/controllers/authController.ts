import { HttpException } from "../utils/exceptions/httpException";
import {Request,Response,NextFunction} from 'express';
import { authService } from "../services/authService";
import { successResponse } from "../utils/apiResponse";


export class AuthController
{
    private authService:authService;
    constructor()
    {
        this.authService=new authService();
    }
    async signup(req:Request,res:Response,next:NextFunction)
    {
        try
        {
        console.log("Entered signup controller");
        const {identifier}=req.body;
        console.log("Signup request received for identifier: ",identifier)
        const result=await this.authService.initiateSignup(identifier);
        res.status(200).json(successResponse({result,message:"OTP sent successfully"}))
        }
        catch(err)
        {
            next(err)
        }



    }
    async verify(req:Request,res:Response,next:NextFunction)
    { 
        try
        {
         const {identifier,code}=req.body;
         const result=await this.authService.verifySignup(identifier,code);
         res.status(200).json(successResponse({result,message:"OTP verified successfully"}))
        }
        catch(err)
        {
            next(err)
        }

    }
    async confirm(req:Request,res:Response,next:NextFunction)
    {
        try
        {
           const{identifier,password}=req.body;
           const result=await this.authService.completeSignup(identifier,password);
           res.status(200).json(successResponse({result,message:"Signup completed successfully"}))
        }
        catch(err)
        {
            next(err)
        }
    }
}