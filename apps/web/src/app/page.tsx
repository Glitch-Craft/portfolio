import { ContactSection } from '@/components/sections/contact-section';
import { HeroSection } from '@/components/sections/hero-section';
import { ManifestoSection } from '@/components/sections/manifesto-section';
import { Ticker } from '@/components/sections/ticker';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Ticker />
      <ManifestoSection />
      <ContactSection />
    </>
  );
}
