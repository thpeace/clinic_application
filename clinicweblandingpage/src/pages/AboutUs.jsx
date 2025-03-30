import { useTranslation } from "react-i18next";

export const AboutUs = () => {
  const { t } = useTranslation();

  return (
    <section className="container mx-auto h-screen">
      <div className="flex flex-col items-center justify-center space-y-10 m-10">
        <h1 className="text-3xl font-bold underline">{t("about")}</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque
          magnam autem perspiciatis reprehenderit sequi praesentium eveniet
          dolore, ipsa modi. Architecto dolores amet, recusandae veritatis rem
          quis soluta enim sequi asperiores! Veniam, officia fuga, dignissimos
          nemo quis natus nam blanditiis non eveniet ducimus placeat minima?
          Distinctio itaque eaque eius sint mollitia quis doloribus dolor
          eveniet animi, fugit sapiente aliquid quae tenetur!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem
          veritatis, perferendis possimus laboriosam incidunt assumenda ducimus
          similique quia sunt rem tenetur. Perferendis vitae hic at harum, dicta
          culpa labore reiciendis?
        </p>
      </div>
    </section>
  );
};
