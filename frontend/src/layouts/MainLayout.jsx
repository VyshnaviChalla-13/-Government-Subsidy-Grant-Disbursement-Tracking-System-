import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import Footer from "../components/Footer/Footer";

function MainLayout() {
    return (
        <>
            <Navbar />
            <Sidebar />

            <h1>Main Content</h1>

            <Footer />
        </>
    );
}

export default MainLayout;