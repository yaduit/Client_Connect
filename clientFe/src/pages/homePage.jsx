import Navbar from "../components/layout/navbar.jsx";
import HeroSection from "../components/layout/heroSection.jsx";
import CategoryGrid from "../components/layout/categoryGrid.jsx";
import TopServices from "../components/layout/topServices.jsx";
import HowItWorks from "../components/layout/howitWorks.jsx";
import Footer from "../components/layout/footer.jsx";
const HomePage = () => {
  return (
    <>
      <Navbar />
      <HeroSection/>
      <CategoryGrid/>
      <TopServices/>
      <HowItWorks/>
      <Footer/>
      {/* other sections */}
    </>
  );
};

export default HomePage;
