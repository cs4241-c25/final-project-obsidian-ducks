import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectToDatabase from '@/lib/db';

export async function POST(req: Request) {
    try {
        await connectToDatabase();

        const formData = await req.formData();
        const username = formData.get('username');
        const password = formData.get('password');


        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }


        const newUser = new User({ username, password });
        await newUser.save();

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (e) {
        console.error("Signup API Error:", e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}