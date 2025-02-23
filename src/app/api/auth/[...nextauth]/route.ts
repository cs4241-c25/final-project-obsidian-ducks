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
                console.log("getting called")
                if (credentials === undefined) {
                    return;
                }
                await connectToDatabase();


                const user = await User.findOne({ username: credentials.username, password: credentials.password });
                if (user) {
                    return { id: user._id.toString(), name: user.username };
                } else {
                    return null;
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: "jwt", // Ensure JWT strategy is used
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
