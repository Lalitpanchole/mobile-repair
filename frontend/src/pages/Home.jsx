import HeroSection from '../components/home/HeroSection';
import DeviceCategories from '../components/home/DeviceCategories';
import { ServicesSection, ExplainerVideoSection, ProcessSection, CTASection, ReviewsSection } from '../components/home/HomeSections';

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <DeviceCategories />
      <ServicesSection />
      <ExplainerVideoSection />
      <ProcessSection />
      <ReviewsSection />
      <CTASection />
    </div>
  );
}

