import Link from "next/link";
import Button from "@/components/Button";

export default function ProfilePage() {
    return (
        <main>
            <h1>Username and Pic here</h1>

            <div style={{ marginTop: '20px' }}>
                <Link href="/shop">
                    <Button>Your Shop</Button>
                </Link>
                <Link href="/saved">
                    <Button>Saved</Button>
                </Link>
                <Link href="/edit-profile">
                    <Button>Edit Profile</Button>
                </Link>
            </div>
        </main>
    );
} //buttons do not do anything yet, just setting up page