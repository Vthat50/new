import Navigation from './Navigation';
import Hero from './Hero';
import ProblemStatement from './ProblemStatement';
import Features from './Features';
import Dashboard from './Dashboard';
import Analytics from './Analytics';
import WhyNow from './WhyNow';
import CTA from './CTA';
import Footer from './Footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <ProblemStatement />
      <Features />
      <Dashboard />
      <Analytics />
      <WhyNow />
      <CTA />
      <Footer />
    </main>
  );
}
