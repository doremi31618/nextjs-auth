import { NextResponse } from "next/server";
import db from '@/lib/db'
import {hash} from 'bcrypt';
import * as z from "zod";

//Define a schema for input validation
const userSchema = z
    .object({
        username: z.string().min(1, "Username is required").max(100),
        email: z.string().min(1, 'Email is required').email('Invalid email'),
        password: z.string().min(1, 'Password is required').min(8, 'password must have then 8 characters'),
    })

export async function POST(req : Request) {
    try {
        const body = await req.json();
        const {email, username, password } = userSchema.parse(body);

        //check if email already exists
        const exitingUserByEmail = await db.user.findUnique({
            where: {email: email}
        })
        if (exitingUserByEmail){
            return NextResponse.json({
                user:null, message: "user with this email alredy exists"
            }, {
                status:409
            })
        }

        // check if the username already exits
        const existingUserByUsername = await db.user.findFirst({
            where: {username:username}
        })
        if (existingUserByUsername) {
            return NextResponse.json({
                user:null,
                message: "User with this email already exists",
            }, {
                status:409
            })
        }
        const hashpassword = await hash(password, 10);
        const newUser = await db.user.create({
            data: {
                username,
                email,
                password : hashpassword
            }
        })
        const {password: newUserPassword, ...rest} = newUser;

        return NextResponse.json({user: rest, message: "usesr created successfully"},{ status: 201});
    }catch(e){
        console.warn("bad request",e);
        return NextResponse.json({
            user: null,
            message: "something went wrong"
        },{
            status:500
        })
    }
}