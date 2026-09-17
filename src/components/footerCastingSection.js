import { lora } from "@/lib/fonts";
import { shadowsIntoLightTwo } from "@/lib/fonts";
import Image from "next/image";
import Link from "next/link";
import placeholder from "@/assets/images/waste-med-logo.jpg";

const t = {
  pl: { welcome: "Zapraszamy do współpracy" },
  en: { welcome: "We invite you to cooperate" },
};

export const FooterCastingSection = ({
  headline,
  subheadline,
  blocks,
  locale,
}) => {
  const tr = t[locale];

  if (!(headline || subheadline || blocks || locale)) return null;

  return (
    <section className="bg-sky-500 py-20 lg:py-30">
      <div className="container max-w-7xl px-4 mx-auto w-full">
        <div className="flex flex-col justify-center items-center mb-14 lg:mb-24">
          <a
            href="https://odpady-medyczne.com.pl"
            target="_blank"
            rel="noopener"
            className="text-white hover:text-slate-300"
          >
            <Image
              src={placeholder}
              width={placeholder.width}
              height={placeholder.height}
              className="w-sm h-auto bg-black"
              alt="Waste-Med - Odbór, transport i utylizacja odpadów medycznych"
            />
          </a>
          <p className="text-xl text-white mt-4">{tr.welcome}</p>
        </div>
        <div className="container max-w-7xl mx-auto flex flex-row gap-5 justify-center items-center">
          <hr className="text-white w-1/8" />
          <h2
            className={`${lora.className} text-[40px] lg:text-6xl font-light text-center lg:py-1 text-white`}
          >
            {headline[locale]}
          </h2>
          <hr className="text-white w-1/8" />
        </div>
        <div>
          <p
            className={`${shadowsIntoLightTwo.className} text-[20px] lg:text-2xl text-center text-white`}
          >
            {subheadline[locale]}
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-42 justify-center items-start text-sm lg:text-[16px] text-white font-bold pt-6 lg:pt-16">
          <div className="w-full">
            <div className="text-lg uppercase text-center">
              {blocks[0].title[locale]}
            </div>
            <Link href="/casting">
              <div className="flex mx-auto w-fit px-10 py-5 my-5 lg:my-10 bg-white">
                <div className="max-lg:max-w-60 lg:w-60 mx-auto">
                  <Image
                    src={blocks[0].logo[locale].image.asset.url}
                    width={
                      blocks[0].logo[locale].image.asset.metadata.dimensions
                        .width
                    }
                    height={
                      blocks[0].logo[locale].image.asset.metadata.dimensions
                        .height
                    }
                    alt={blocks[0].logo[locale].alt}
                    className=""
                  />
                </div>
              </div>
            </Link>
            <div className="text-justify">
              {blocks[0].description[locale].map((text, index) => (
                <div key={index}>{text}</div>
              ))}
            </div>
          </div>
          <div className="">
            <div className="text-lg uppercase text-center">
              {blocks[1].title[locale]}
            </div>
            <Link href="/casting">
              <div className="flex mx-auto w-full lg:w-134 lg:px-10 py-5 lg:my-10 ">
                <Image
                  src={blocks[1].logo[locale].image.asset.url}
                  width={
                    blocks[1].logo[locale].image.asset.metadata.dimensions.width
                  }
                  height={
                    blocks[1].logo[locale].image.asset.metadata.dimensions
                      .height
                  }
                  alt={blocks[1].logo[locale].alt}
                  className="max-lg:w-100 mx-auto"
                />
              </div>
            </Link>
            <div className="text-justify">
              {blocks[1].description[locale].map((text, index) => (
                <div key={index}>{text}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div id="section7" className="w-full" />
    </section>
  );
};
