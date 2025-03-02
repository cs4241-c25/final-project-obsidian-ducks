import { Oswald } from "next/font/google";

const oswald = Oswald({
    subsets: ["latin"]
});

export default function HeroSection() {
    return (
        <section className="w-screen flex justify-center relative mb-8">
            <div className="absolute w-9/10 h-full rounded-lg bg-linear-to-r from-crimson-deep to-crimson-deep opacity-50"></div>
            <img className="w-9/10 rounded-lg" src="/WPIHero.png" alt="WPI's campus"/>
            <div className="absolute top-0 left-0 w-45/100 h-full flex justify-center items-center">
                <p className={`${oswald.className} inline text-center text-white opacity-90 
                    md:font-medium lg:font-semibold 
                    text-base sm:text-xl md:text-lg lg:text-xl xl:text-3xl 2xl:text-4xl 
                    tracking-wider lg:tracking-widest xl:tracking-[0.10em] 2xl:tracking-[0.15em]
                    leading-[15px] md:leading-[25px] lg:leading-[40px] xl:leading-[50px] 2xl:leading-[65px] 
                    `}>
                    Sell, Buy, and Swap<br/>
                    Secondhand Items with<br/>
                    Fellow WPI Students
                </p>
            </div>
        </section>
    );
}