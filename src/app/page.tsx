import Link from "next/link";

import Button from "@/components/Button";
import { FileUploadTest } from "@/components/FileUploadTest";

export default function Home() {
    return (
        <main>
            <div>Wpi buys</div>
            <FileUploadTest/>
            <Link href="/sell">
                <Button type={"button"}>Sell an Item</Button>
            </Link>
            <Link href="/profile">
                <Button type={"button"}>Profile</Button>
            </Link>
        </main>
    );
}
