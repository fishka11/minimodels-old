// src/components/sectionContent.js
import Image from "next/image";
import { SectionText } from "@/components/sectionText";
import { ArrowDown } from "@/components/arrowDown";
import { SectionSlider } from "@/components/sectionSlider";
import { SectionVideo } from "@/components/sectionVideo";
import Link from "next/link";

export function SectionContent({
  texts,
  locale,
  slides,
  video,
  image,
  imageAlt,
  imageLeft = false,
  button,
  anchor,
  loraFontFirst = false,
  textBreak = false,
}) {
  const videoEl = video && (
    <div className="">
      <div className="sm:min-w-md max-w-md md:max-w-lg lg:max-w-2xl flex justify-center lg:justify-end w-full">
        <SectionVideo locale={locale} video={video} />
      </div>
    </div>
  );
  const sliderEl = slides && (
    <div className="">
      <SectionSlider locale={locale} slides={slides} />
    </div>
  );
  const imageEl = image && (
    <div className="">
      <Image
        className="max-w-158 w-full max-lg:w-full mx-auto"
        src={image}
        alt={imageAlt}
      />
    </div>
  );
  const textEl = texts && (
    <SectionText
      texts={texts}
      locale={locale}
      loraFontFirst={loraFontFirst}
      textBreak={textBreak}
    />
  );
  const buttonEl = button && (
    <Link
      className="flex mx-auto px-8 py-4 text-lg uppercase text-sky-500 border-2 border-sky-500 hover:border-black hover:text-black transition-colors duration-200 ease-in"
      href={button.url}
    >
      {button.label[locale]}
    </Link>
  );

  return (
    <div className="text-center text-black bg-white flex items-center justify-center py-16">
      <div className="container max-w-7xl mx-auto px-4 flex flex-col gap-10">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-6 w-full">
          {imageLeft ? (
            <>
              <div className="w-full lg:w-1/2 mx-auto">
                {imageEl || sliderEl || videoEl}
              </div>
              <div className="w-full lg:w-1/2">
                {textEl}
                {buttonEl}
              </div>
            </>
          ) : (
            <>
              <div className="w-full lg:w-1/2 flex flex-col gap-6 items-center justify-center">
                {textEl}
                {buttonEl}
              </div>
              <div className="w-full lg:w-1/2 mx-auto">
                {imageEl || sliderEl || videoEl}
              </div>
            </>
          )}
        </div>
        {anchor && <ArrowDown anchor={anchor} />}
      </div>
    </div>
  );
}
