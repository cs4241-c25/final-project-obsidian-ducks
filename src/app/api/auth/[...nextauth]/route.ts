// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/models/User';
import connectToDatabase from '@/lib/db';

// @ts-ignore
export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            // @ts-ignore
            async authorize(credentials) {
                if (credentials === undefined) {
                    return;
                }
                await connectToDatabase(); // Ensure the database is connected

                // Find the user in the database
                const user = await User.findOne({ username: credentials.username, password: credentials.password });
                if (user) {
                    return { id: user._id.toString(), name: user.username };
                } else {
                    return null; // Invalid credentials
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };