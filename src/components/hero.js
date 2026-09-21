import Image from "next/image";
import { lora } from "@/lib/fonts";
import { FloatingButton } from "@/components/floatingButton";
import { ArrowDown } from "@/components/arrowDown";
import { SectionVideo } from "./sectionVideo";

export const Hero = ({ locale, video, texts, bgImage, image, button }) => {
  return (
    <div
      className={`relative grid place-items-center bg-fixed bg-cover bg-top`}
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="[grid-area:1/1] h-full text-white w-full">
        <div className="mx-auto h-full grid grid-cols-1 place-content-between text-center gap-4 pt-22 lg:pt-0">
          <div className="sm:min-w-md max-w-md md:max-w-lg lg:max-w-150 mx-auto container max-sm:px-4 pt-14 lg:pt-34">
            {video && <SectionVideo locale={locale} video={video} />}
          </div>
          <div className="relative container max-w-7xl mx-auto px-4 mt-4">
            <hr className="before:content-[''] before:absolute before:block before:w-2 before:h-2 before:bg-white before:rotate-45 before:-top-1 before:left-1/2" />
          </div>
          <div className="container max-w-7xl mx-auto px-4 flex flex-col 3xl:gap-3">
            <h1 className="text-xl 3xl:text-[28px] font-bold uppercase mx-auto leading-normal 3xl:leading-9">
              {texts?.[locale]?.[0]}
            </h1>
            <p className="text-lg 3xl:text-[28px] font-light uppercase mx-auto leading-normal 3xl:leading-9">
              {texts?.[locale]?.[1]}
            </p>
            <p className="text-lg 3xl:text-[28px] font-light uppercase mx-auto mt-6 leading-normal 3xl:leading-9">
              {texts?.[locale]?.[2]}
              <br />
              <span>{texts?.[locale]?.[3]}</span>{" "}
              <span
                className={`${lora.className} uppercase font-bold text-pink-500`}
              >
                {texts?.[locale]?.[4]}
              </span>
            </p>
          </div>
          <div className="container max-w-7xl mx-auto px-4">
            <FloatingButton locale={locale} button={button} />
          </div>
          <ArrowDown anchor="section2" />
          <div className="flex flex-col gap-5">
            <p className="text-lg lg:text-xl mx-auto px-4">
              {texts?.[locale]?.[5]}
            </p>
            <div
              className="w-full h-48"
              style={{ backgroundImage: `url(${image})` }}
            >
              {/* <Image
                src={image}
                alt={`${locale === "pl" ? "Logotypy partnerów Minimodels" : "Logos of Minimodels partners"}`}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
