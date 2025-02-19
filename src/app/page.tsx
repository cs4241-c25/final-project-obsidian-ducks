import Link from "next/link";

import Button from "@/components/Button";

export default function Home() {
    return (
        <main>
            <div>Wpi buys</div>
            <Link href="/sell">
                <Button>Sell an Item</Button>
            </Link>
            <Link href="/profile">
                <Button>Profile</Button>
            </Link>
        </main>
    );
}
