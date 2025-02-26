import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export const handleLogout = async () => {
    const router = useRouter();
    try {
        await signOut({ redirect: false });
        router.push('/login');
    } catch (error) {
        console.error("Logout failed:", error); // Debugging
    }
};