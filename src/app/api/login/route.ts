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
        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }


        return NextResponse.json({ success: true }, { status: 200 });
    } catch (e) {
        console.error("Login API Error:", e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}