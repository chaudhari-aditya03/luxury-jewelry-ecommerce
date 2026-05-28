import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Gem, ShieldCheck, HeartHandshake } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

const storyPoints = [
  {
    title: 'Curated design language',
    description: 'Every screen shares the same ivory, gold, and charcoal palette with rounded cards and soft shadows.',
  },
  {
    title: 'Jewelry-first merchandising',
    description: 'Product storytelling, 3:4 imagery, and editorial spacing keep the focus on the pieces themselves.',
  },
  {
    title: 'Mobile-first shopping',
    description: 'Navigation, grids, forms, and checkout are tuned for small screens without horizontal scrolling.',
  },
];

const values = [
  { icon: Gem, title: 'Craft', text: 'High-touch presentation for timeless collections.' },
  { icon: ShieldCheck, title: 'Trust', text: 'Secure flows, clear details, and safe account management.' },
  { icon: HeartHandshake, title: 'Service', text: 'A calm shopping experience built for gifting and care.' },
];

const AboutPage = () => {
  return (
    <MainLayout>
      <section className="page-section">
        <div className="page-shell content-stack">
          <header className="page-card overflow-hidden p-6 md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="page-eyebrow">Our Story</p>
                <h1 className="page-title mt-4 max-w-2xl">Jewelry Maison is built to feel like a premium editorial boutique.</h1>
                <p className="page-subtitle">
                  The storefront was reworked into one consistent luxury experience: polished typography, soft surfaces,
                  and responsive product discovery that respects the jewelry.
                </p>
                <div className="stacked-actions mt-8">
                  <Link to="/shop" className="btn-primary inline-flex items-center justify-center no-underline">
                    Shop Collection
                  </Link>
                  <Link to="/contact" className="btn-secondary inline-flex items-center justify-center no-underline">
                    Contact Concierge
                  </Link>
                </div>
              </div>

              <div className="page-card-soft p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-luxury text-white shadow-sm">
                    <Sparkles className="h-5 w-5 text-gold" />
                  </span>
                  <div>
                    <p className="page-eyebrow">Maison Promise</p>
                    <p className="mt-1 text-sm text-muted">A calm, luxurious shopping environment.</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  {values.map((value) => {
                    const Icon = value.icon;

                    return (
                      <div key={value.title} className="rounded-[1.25rem] border border-[#eadfca] bg-[#fcfaf6] p-4">
                        <Icon className="h-5 w-5 text-gold" />
                        <h3 className="mt-3 font-display text-xl text-charcoal-700">{value.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-muted">{value.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </header>

          <div className="responsive-grid responsive-grid--wide">
            {storyPoints.map((point) => (
              <article key={point.title} className="page-card p-6 md:p-8">
                <p className="page-eyebrow">Design Principle</p>
                <h2 className="mt-3 font-display text-2xl text-charcoal-700">{point.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted">{point.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AboutPage;