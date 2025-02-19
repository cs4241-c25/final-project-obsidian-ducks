import Link from "next/link";

import Button from "@/components/Button";
import { FileUploadTest } from "@/components/FileUploadTest";
import Post from "@/components/Post";

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
            <Post/>
        </main>
    );
}
