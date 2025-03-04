import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectToDatabase from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
    try {
        await connectToDatabase();

        const formData = await req.formData();
        const username = formData.get('username');
        const password = formData.get('password');
        const profileImageUrl = formData.get('profileImage') as File;


        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        //hashing password
        const saltRounds = 10;
        // @ts-ignore
        const hashedPassword = await bcrypt.hash(password, saltRounds);



        const newUser = new User({ username, password: hashedPassword, profileImage: profileImageUrl });
        await newUser.save();

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (e) {
        console.error("Signup API Error:", e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}