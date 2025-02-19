import Link from "next/link";
import Button from "@/components/Button";
import ChatSession from "@/components/chat/chatSession";
import { FileUploadTest } from "@/components/FileUploadTest";

export default function Home() {
    return (
        <main>
            <div>Wpi buys</div>
            <ChatSession/>
            <FileUploadTest/>
            <Link href="/sell">
                <Button>Sell an Item</Button>
            </Link>
        </main>
    );
}
