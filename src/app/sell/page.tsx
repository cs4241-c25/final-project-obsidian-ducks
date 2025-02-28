import ListingForm from "./ListingForm";
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function SellPage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/login');
    }
    return (
        <main className="absolute z-0 top-0 left-0 w-screen h-screen flex justify-center items-center">
            <ListingForm />
        </main>
    );
}