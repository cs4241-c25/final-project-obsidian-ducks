'use client';
import Link from "next/link";
import Button from "@/components/Button";
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const handleLogout = async (router: string[]) => {
    try {
        await signOut({ redirect: false });
        router.push('/profile');
    } catch (error) {
        console.error("Logout failed:", error); // Debugging
    }
};

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();


    return (
        <main>
            <h1>Profile Page</h1>
            {status === 'authenticated' ? (
                <div>
                    <h1>Welcome, {session.user?.name}</h1>
                    <div style={{ marginTop: '20px' }}>
                        <Link href="/shop">
                            <Button type={"button"}>My Shop</Button>
                        </Link>
                        <Link href="/edit-profile">
                            <Button type={"button"}>Edit Profile</Button>
                        </Link>

                        <Button type={"button"} onClick={handleLogout}>Logout</Button>
                    </div>
                </div>
            ) : (
                <div>
                    <p>Please log in to view your profile.</p>
                    <Link href="/login">
                        <Button type={"button"}>Login</Button>
                    </Link>
                </div>

            )}



        </main>
    );
}

export { handleLogout };