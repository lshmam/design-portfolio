import Header from '@/components/header';
import HeroSection from '@/components/hero-section';
import HowItWorks from '@/components/how-it-works';
import StyleShowcase from '@/components/style-showcase';
import PricingSection from '@/components/pricing-section';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <HowItWorks />
        <section id="styles">
          <StyleShowcase />
        </section>
        <section id="pricing">
          <PricingSection />
        </section>
      </main>
      <Footer />
    </>
  );
}
