import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectToDatabase from '@/lib/db';
import bcrypt from 'bcrypt';
import { S3Client } from '@aws-sdk/client-s3';
import uploadFile from '@/lib/uploadFile';

export async function POST(req: Request) {
    try {
        await connectToDatabase();

        const formData = await req.formData();
        const username = formData.get('username');
        const password = formData.get('password');
        const profileImage = formData.get('profileImage') as File;


        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        //hashing password
        const saltRounds = 10;
        // @ts-ignore
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        let profileImageUrl: string | undefined = '';
        if (profileImage) {
            const S3 = new S3Client();
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            const MAX_SIZE = 5 * 1024 * 1024;
            const result = await uploadFile(profileImage, S3, allowedTypes, MAX_SIZE);
            if (!result.success) {
                return NextResponse.json({ error: result.message }, { status: 400 });
            }
            profileImageUrl = result.url;
        }



        const newUser = new User({ username, password: hashedPassword, profileImage: profileImageUrl });
        await newUser.save();

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (e) {
        console.error("Signup API Error:", e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}