export interface ApiResponse<T>
{ success:boolean,
  message:string,
  data?:T,
  code?:number
}
export const successResponse=<T>(data:T):ApiResponse<T>=>
({
    success:true,
    message:"success",
    data:data
})
export const errorResponse=(msg:string,code:number):ApiResponse<null> =>
({
    success:false,
    message:msg,
    code:code
})