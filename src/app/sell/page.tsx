import SellForm from "./SellForm";
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function SellPage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/login');
    }
    return (
        <main className="w-screen h-screen flex justify-center items-center absolute top-0 left-0 z-0 px-4">
            <SellForm />
        </main>
    );
}