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
                await connectToDatabase();


                const user = await User.findOne({
                    username: credentials.username,
                    password: credentials.password,
                });

                if (user) {
                    return { id: user._id.toString(), name: user.username };
                } else {
                    return null;
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        // @ts-ignore
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
            }
            return token;
        },
        // @ts-ignore
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.name = token.name;
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };