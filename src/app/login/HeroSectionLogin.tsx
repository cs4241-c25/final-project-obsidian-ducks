import { Oswald } from "next/font/google";

const oswald = Oswald({
    subsets: ["latin"]
});

export default function HeroSectionLogin() {
    return (
        <section className="w-screen h-[740px] relative mb-8">
            <div className="absolute w-full h-full bg-linear-to-r from-crimson-500 to-crimson-500 opacity-50"></div>
            <img className="w-full h-full object-cover" src="/WPI.png" alt="WPI campus"/>
            <div className="absolute top-0 left-0 w-45/100 h-full flex justify-center items-center">
                <p className={`${oswald.className} inline text-center text-white opacity-95 
                    md:font-medium lg:font-semibold 
                    text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 
                    tracking-wider lg:tracking-widest xl:tracking-[0.15em] 2xl:tracking-[0.2em]
                    leading-[30px] md:leading-[45px] xl:leading-[55px] 2xl:leading-[75px] 
                    `}>
                    Sell, Buy, and Swap<br/>
                    Secondhand Items with<br/>
                    Fellow WPI Students
                </p>
            </div>
        </section>
    );
}