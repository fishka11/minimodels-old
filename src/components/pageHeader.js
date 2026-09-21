import { lora, shadowsIntoLightTwo } from "@/lib/fonts";

export const PageHeader = ({ bgImage, title, subTitle }) => {
  return (
    <div
      className={`${bgImage ? "h-80 xl:min-h-130 md:py-10" : "h-60 xl:min-h-80"} py-6  w-full grid grid-cols-1 place-content-center bg-center bg-cover`}
      style={
        bgImage && {
          backgroundImage: `url(${bgImage})`,
        }
      }
    >
      <div className="container max-w-7xl mx-auto flex flex-row gap-5 justify-center items-center">
        <hr className={`${bgImage ? "text-white" : "text-black"} w-1/8`} />
        <h1
          className={`${lora.className} text-[40px] lg:text-6xl font-light text-center leading-tight lg:py-3 ${bgImage ? "text-white" : "text-black"}`}
        >
          {title}
        </h1>
        <hr className={`${bgImage ? "text-white" : "text-black"} w-1/8`} />
      </div>
      <div className="container px-4 mx-auto">
        <p
          className={`${shadowsIntoLightTwo.className} ${bgImage ? "text-white" : "text-pink-500"} text-center text-xl lg:text-2xl`}
        >
          {subTitle && subTitle}
        </p>
      </div>
    </div>
  );
};
