"use client";
import Button from "@/components/Button";
import Link from "next/link";
import Image from "next/image";
import {useState} from "react";

export default function NavBar(){
    const [isOpen, setIsOpen] = useState(false);
    function handleHamburgerClick() {
        setIsOpen(!isOpen);
    }

    function handleMenu() {
        let classes = [];
        if(isOpen) {
            classes = [
                "flex",
                "absolute",
                "top-[90px]",
                "bg-auburn-500",
                "w-full",
                "items-center",
                "justify-between",
                "p-4",
                "border-auburn-600",
                "border-t-2",
                "left-0",
                "z-20",
            ]
        }
        else {
            classes = ["hidden", "md:flex", "justify-end", "items-center", "w-full", "h-fill"]
        }
        return classes.join(" ");
    }

    return (
        <nav className="bg-auburn-500 flex justify-between items-center mx-auto h-[7vh]">
            <Link href="../">
                <Button>
                    <Image src="/WPIBuysLogo.png" alt="WPIBuys Logo" width={100} height={10}/>
                </Button>
            </Link>

            <div className={handleMenu()}>
                <Link href="../favorites">
                    <Button>
                        <Image src="/heart.svg" alt="Heart Image" width={50} height={50}/>
                    </Button>
                </Link>
                <Link href="../sell">
                    <Button className="w-[50px] h-[50px] text-lg">Sell</Button>
                </Link>
                <Link href="../mail">
                    <Button>
                        <Image src="/mail.svg" alt="Mail Image" width={50} height={50}/>
                    </Button>
                </Link>
                <Link href="../profile">
                    <Button>
                        <Image src="/profile.svg" alt="Profile Image" width={50} height={50}/>
                    </Button>
                </Link>
            </div>

            <div className="md:hidden">
                <Button onClick={handleHamburgerClick}>
                    <Image src="/hamburger.svg" alt="Mobile Menu" width={50} height={50}/>
                </Button>
            </div>
        </nav>
    );
}