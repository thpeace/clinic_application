import { Link } from "react-router-dom";
import Logo from "../assets/images/logo.svg";
import { ImageComponent } from "../components/ImageComponent";
import { AnchorComponent } from "../components/AnchorComponent";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";

export const Navbar = () => {
  const { t } = useTranslation();

  const handleClick = () => {
    const menuButton = document.getElementById("menu-btn");
    const menu = document.getElementById("menu");

    menuButton.classList.toggle("open");
    menu.classList.toggle("flex");
    menu.classList.toggle("hidden");
  };

  return (
    <nav className="relative container mx-auto p-6">
      <div className="flex items-center justify-between">
        <div className="p-2 mt-0 md:mt-3">
          <Link to="/">
            <ImageComponent imageSrc={Logo} altText="Logo" title={t("home")} />
          </Link>
        </div>

        {/* Menu items - hidden - mobile first */}
        <ul className="hidden space-x-6 md:flex">
          <li>
            <AnchorComponent
              link="#"
              className="hover:text-darkGrayishBlue"
              title={t("bookAppointment")}
            >
              <Link to="/pricing">{t("bookAppointment")}</Link>
            </AnchorComponent>
          </li>
          <li>
            <AnchorComponent
              link="#"
              className="hover:text-darkGrayishBlue"
              title={t("product")}
            >
              <Link to="/product">{t("viewServices")}</Link>
            </AnchorComponent>
          </li>
          <li>
            <AnchorComponent
              link="#"
              className="hover:text-darkGrayishBlue"
              title={t("about")}
            >
              <Link to="/about">{t("about")}</Link>
            </AnchorComponent>
          </li>
          <li>
            <AnchorComponent
              link="#"
              className="hover:text-darkGrayishBlue"
              title={t("careers")}
            >
              <Link to="/careers">{t("careers")}</Link>
            </AnchorComponent>
          </li>
          <li>
            <AnchorComponent
              link="#"
              className="hover:text-darkGrayishBlue"
              title={t("community")}
            >
              <Link to="/community">{t("community")}</Link>
            </AnchorComponent>
          </li>
        </ul>

        {/* Language Selector */}
        <LanguageSelector />

        {/* Hamburger Icon */}
        <button
          id="menu-btn"
          className="hamburger block md:hidden focus:outline-none"
          onClick={handleClick}
        >
          <span className="hamburger-top"></span>
          <span className="hamburger-middle"></span>
          <span className="hamburger-bottom"></span>
        </button>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div
          id="menu"
          className="hidden absolute flex-col items-center justify-self-end py-8 mt-10 space-y-6 font-bold bg-slate-100 sm:w-auto sm:justify-self-center left-6 right-6 drop-shadow-lg"
        >
          <AnchorComponent
            link="#"
            className="hover:text-brightRed"
            title={t("bookAppointment")}
          >
            <Link to="/pricing">{t("bookAppointment")}</Link>
          </AnchorComponent>
          <AnchorComponent
            link="#"
            className="hover:text-brightRed"
            title={t("product")}
          >
            <Link to="/product">{t("product")}</Link>
          </AnchorComponent>
          <AnchorComponent
            link="#"
            className="hover:text-brightRed"
            title={t("about")}
          >
            <Link to="/about">{t("about")}</Link>
          </AnchorComponent>
          <AnchorComponent
            link="#"
            className="hover:text-brightRed"
            title={t("careers")}
          >
            <Link to="/careers">{t("careers")}</Link>
          </AnchorComponent>
          <AnchorComponent
            link="#"
            className="hover:text-brightRed"
            title={t("community")}
          >
            <Link to="/community">{t("community")}</Link>
          </AnchorComponent>
        </div>
      </div>
    </nav>
  );
};
