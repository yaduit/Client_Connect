import HeroSection from "../components/layout/heroSection.jsx";
import CategoryGrid from "../components/layout/categoryGrid.jsx";
import TopServicesNearYou from "../components/layout/topServices.jsx";
import HowItWorks from "../components/layout/howitWorks.jsx";
import Footer from "../components/layout/footer.jsx";
const HomePage = () => {
  return (
    <>
      <HeroSection/>
      <CategoryGrid/>
      <TopServicesNearYou/>
      <HowItWorks/>
      <Footer/>
      {/* other sections */}
    </>
  );
};

export default HomePage;
