import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authServices";
import { successResponse } from "../utils/apiResponse";
import { HttpException } from "../utils/exceptions/httpException";

export class authController{
    private authService:AuthService;

    constructor(){
        this.authService=new AuthService()
    }

    async Signup_Pass(req:Request,res:Response,next:NextFunction)
    {
        try
        {
            const {email,mobile_no,password}=req.body;
            const user=await this.authService.Signup_withPass(email,mobile_no,password)
            res.status(200).json(successResponse(user))
        }
        catch(err:any)
        {
            next(err instanceof HttpException ? err :new HttpException(500,err.message));
        }
    }
}