import pool from "../config/db";
import bcrypt from 'bcrypt';
import { HttpException } from "../utils/exceptions/httpException";

export class AuthService
{ 
    async Signup_withPass(email?:string,mobile_no?:string,password?:string)
    {
        if(!email && !mobile_no){
           throw new HttpException(400,"Either Email or MobileNumber must be provided")
        }
        if(!password)
        {
            throw new HttpException(400,"Password is required")
        }
        console.log("Control passed to authService.....")
        const isEmail=!! email;
        const identifier=isEmail ? email : mobile_no;
        console.log(`${isEmail ? 'email' : 'mobile_number'} is present ${identifier}`)
        
        console.log("Checking Existing user Query")
        const ex_query=isEmail ? `SELECT email FROM users WHERE email=$1` : `SELECT mobile_number FROM users WHERE mobile_number=$1`;

        const existing=await pool.query(ex_query,[identifier]);
        if(existing.rows.length>0)
        {
            throw new HttpException(409,`${isEmail ? 'Email' : 'Mobile_number'} already registered`)
        }
        console.log("Checking Insert Query.....")
        const inst_query=isEmail?`INSERT INTO users (email,created_at) VALUES ($1,NOW()) RETURNING id`:
        `INSERT INTO users (mobile_number,created_at) VALUES($1,NOW()) RETURNING id`;
        
        const insert=await pool.query(inst_query,[identifier]);
        const id=insert.rows[0].id;
        console.log("User inserted and returned id",id)
        console.log("Hashing Password",password)
        const hash_pass=await bcrypt.hash(password,10)
        console.log("Password Hashed Successfully",hash_pass)
        console.log("Inserting Into auth_credentials........")
        await pool.query(`INSERT INTO auth_credentials (user_id,password_hash,created_at) VALUES($1,$2,NOW())`,[id,hash_pass])
        console.log("Completed Inserting Into auth_credentials........ Control now changed to authController")
        return {id}
    }

}