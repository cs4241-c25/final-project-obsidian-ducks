import Link from "next/link";

import Button from "@/components/Button";
import WsTest from "@/components/wsTest";

export default function Home() {
    return (
        <main>
            <div>Wpi buys</div>
            <WsTest></WsTest>
            <Link href="/sell">
                <Button>Sell an Item</Button>
            </Link>
        </main>
    );
}
