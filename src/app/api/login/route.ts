import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectToDatabase from '@/lib/db';

export async function POST(req: Request) {
    try {
        await connectToDatabase();

        const formData = await req.formData();
        const username = formData.get('username');
        const password = formData.get('password');

        const user = await User.findOne({ username, password });
        if (!user) {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (e) {
        console.error("Login API Error:", e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}