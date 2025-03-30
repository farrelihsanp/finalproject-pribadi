import Footer from '@/components/common/footer';
import Navbar from '@/components/common/navbar';
import LandingCategory from '@/components/common/landingCategory';
import LandingProduct from '@/components/common/landingProduct';
import Hero from '@/components/common/Hero';
import SearchBar from '@/components/common/searchbar';

export default function HomeCustomers() {
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
