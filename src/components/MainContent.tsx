import Hero from './sections/Hero';
import Services from './sections/Services';
import Partners from './sections/Partners';
import Separator from './ui/Separator';

export default function MainContent() {
  return (
    <main>
      <Hero />
      <Separator />
      <Services />
      <Separator />
      <Partners />
    </main>
  );
} 