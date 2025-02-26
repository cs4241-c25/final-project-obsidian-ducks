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

        const response = NextResponse.json(
            { success: true, user: { id: user._id, username: user.username } },
            { status: 200 }
        );

        response.cookies.set('auth_token', user._id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
            sameSite: 'strict',
        });

        return response;
    } catch (e) {
        console.error('Login API Error:', e);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}