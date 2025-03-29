import Navbar from '../components/navbar';
import LandingCategory from '../components/landingCategory';
import LandingProduct from '../components/landingProduct';
import Footer from '../components/footer';
import Hero from '../components/Hero';
import SearchBar from '../components/searchbar';

export default function Home() {
  return (
    <section>
      <Navbar />
      <SearchBar />
      <Hero />
      <LandingCategory />
      <LandingProduct />
      <Footer />
    </section>
  );
}
