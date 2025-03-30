import Navbar from '../components/common/navbar';
import LandingCategory from '../components/common/landingCategory';
import LandingProduct from '../components/common/landingProduct';
import Footer from '../components/common/footer';
import Hero from '../components/common/Hero';
import SearchBar from '../components/common/searchbar';
// import Location from '../components/common/location';

export default function Home() {
  return (
    <section>
      <Navbar />
      <SearchBar />
      {/* <Location /> */}
      <Hero />
      <LandingCategory />
      <LandingProduct />
      <Footer />
    </section>
  );
}
