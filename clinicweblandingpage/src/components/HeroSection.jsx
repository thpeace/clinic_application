import HeroImage from "../assets/images/illustration-intro.svg";
import { ImageComponent } from "../components/ImageComponent";
import { AnchorComponent } from "../components/AnchorComponent";
import LanguageSelector from "./LanguageSelector";

export const HeroSection = () => {
  return (
    <section id="#hero">
      <div className="container flex flex-col-reverse items-center px-6 mx-auto mt-10 space-y-0 md:flex-row md:space-y-0">
        <div className="flex flex-col mb-32 space-y-12 md:w-1/2">
          <h1 className="max-w-md text-4xl font-bold text-center md:text-5xl md:text-left">
            Bring everyone together to build better products
          </h1>
          <p className="max-w-sm text-center text-darkGrayishBlue md:text-left">
            Manage makes it simple for software temas to plan day-to-day tasks
            while keeping the larger team goals in view.
          </p>
          <div className="flex justify-center md:justify-start">
            <AnchorComponent
              link="#"
              className="p-3 px-6 pt-2 rounded-full baseline text-white bg-brightRed hover:bg-brightRedLight"
            >
              Get started
            </AnchorComponent>
          </div>
        </div>

        <div className="md:w-1/2">
          <ImageComponent imageSrc={HeroImage} altText="Graph illustration" />
        </div>
      </div>
    </section>
  );
};
