import { HttpException } from "../utils/exceptions/httpException";
import pool from "../config/db";
import { VerificationService } from "./otpService";
import bcrypt from 'bcrypt';

const vService=new VerificationService();
export class authService
{
    async initiateSignup(identifier:string)
    {
        console.log("Initiating signup for ",identifier)
        const isMobile=/^[0-9]{10}$/.test(identifier);
        const isEmail=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
        const type=isMobile?"mobile_number":"email";
        console.log("Identifier is ",identifier," Type is ",type);
        if(!isMobile && !isEmail)
        {  throw new HttpException(400,"Invalid type of credentials") }
        console.log("Checking existing user")
        const existing=await pool.query(`SELECT id FROM users WHERE ${type}=$1`,[identifier]);
        if(existing.rows.length>0)
        {
            throw new HttpException(409,"User already exists");
        }
        console.log("No existing user found, sending OTP");
        return await vService.sendCode(identifier,type);
    }
    async verifySignup(identifier:string,code:string)
    {
        console.log("Verifying The code for ",identifier)
        const isMobile=/^[0-9]{10}$/.test(identifier);
        const isEmail=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
        const type=isMobile?"mobile_number":"email";
        console.log("Identifier is ",identifier," Type is ",type);
        if(!isMobile && !isEmail)
        {  throw new HttpException(400,"Invalid type of credentials") }
        return await vService.verifyCode(identifier,type,code);
    }
    async completeSignup(identifier:string,password:string)
    {
        console.log("Completing signup for ",identifier)
        const isMobile=/^[0-9]{10}$/.test(identifier);
        const isEmail=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
        const type=isMobile?"mobile_number":"email";
        const vcolumn=isMobile?"is_mobile_verified":"is_email_verified";
        console.log("Identifier is ",identifier," Type is ",type);
        if(!isMobile && !isEmail)
        {  throw new HttpException(400,"Invalid type of credentials") }
        const user=await pool.query(`SELECT id FROM users WHERE ${type}=$1 AND ${vcolumn}=TRUE`,[identifier]);
        const user_id=user.rows[0]?.id;
        if(user.rows.length===0)
        {
            throw new HttpException(404,"Verification pending or user not found");
        }
        const hashedPassword=await bcrypt.hash(password,10);
        await pool.query(`INSERT INTO auth_credentials (password_hash, user_id) VALUES ($1, $2)`,[hashedPassword,user_id]);
        console.log("Signup completed for ",identifier)
        return {message:"Signup completed successfully"};
    }
   
}