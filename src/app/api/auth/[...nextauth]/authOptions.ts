import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/models/User';
import connectToDatabase from '@/lib/db';
import bcrypt from "bcrypt";

// @ts-ignore
export default const  authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            // @ts-ignore
            async authorize(credentials) {

                if (!credentials) {
                    console.error('No credentials provided');
                    return null;
                }

                try {
                    await connectToDatabase();


                    const user = await User.findOne({ username: credentials.username });
                    if (!user) {

                        return null;
                    }

                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordValid) {
                        console.error('Invalid password for user:', credentials.username);
                        return null;
                    }

                    return { id: user._id.toString(), name: user.username };
                } catch (error) {
                    console.error('Error during authorization:', error);
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
