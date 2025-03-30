import { Routes, Route, BrowserRouter } from "react-router-dom";

import { Home } from "../pages/Home";
import { Pricing } from "../pages/Pricing";
import { Product } from "../pages/Product";
import { AboutUs } from "../pages/AboutUs";
import { Careers } from "../pages/Careers";
import { Community } from "../pages/Community";
import { Navbar } from "../components/Navbar";
import { FooterComponent } from "../components/FooterComponent";

export default function Routers() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route index path="/" element={<Home />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/product" element={<Product />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/community" element={<Community />} />
            </Routes>
            <FooterComponent />
        </BrowserRouter>
    );
}
