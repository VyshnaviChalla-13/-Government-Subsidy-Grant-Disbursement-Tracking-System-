import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import QuickServices from "../../components/QuickServices/QuickServices";
import FeaturedSchemes from "../../components/FeaturedSchemes/FeaturedSchemes";
import Footer from "../../components/Footer/Footer";
function Home() {
    return (
        <>
        <Navbar/>
        <div className="home-page">
            <Hero />
            <QuickServices />
            <FeaturedSchemes />
            <Footer />
        </div>
        </>
    );
}

export default Home;