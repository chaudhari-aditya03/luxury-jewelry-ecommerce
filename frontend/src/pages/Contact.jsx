import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Sparkles } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

const contactPoints = [
  { icon: Phone, label: 'Phone', value: '+91 7709648063' },
  { icon: Mail, label: 'Email', value: 'aditya@jewelrystore.com' },
  { icon: MapPin, label: 'Studio', value: '123 Luxury Avenue, Mumbai' },
];

const ContactPage = () => {
  return (
    <MainLayout>
      <section className="page-section">
        <div className="page-shell content-stack">
          <header className="page-card p-6 md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <p className="page-eyebrow">Contact</p>
                <h1 className="page-title mt-4 max-w-2xl">Talk to the Jewelry Maison concierge.</h1>
                <p className="page-subtitle">
                  Reach out for gifting help, order questions, size guidance, or custom requests. The layout stays compact on mobile and elegant on desktop.
                </p>
                <div className="stacked-actions mt-8">
                  <a href="mailto:aditya@jewelrystore.com" className="btn-primary inline-flex items-center justify-center no-underline">
                    Email Us
                  </a>
                  <Link to="/shop" className="btn-secondary inline-flex items-center justify-center no-underline">
                    Continue Shopping
                  </Link>
                </div>
              </div>

              <div className="page-card-soft p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-luxury text-white shadow-sm">
                    <Sparkles className="h-5 w-5 text-gold" />
                  </span>
                  <div>
                    <p className="page-eyebrow">Concierge Hours</p>
                    <p className="mt-1 text-sm text-muted">Mon-Sat · 10:00 AM to 7:00 PM</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {contactPoints.map((point) => {
                    const Icon = point.icon;

                    return (
                      <div key={point.label} className="flex items-center gap-4 rounded-[1.25rem] border border-[#eadfca] bg-[#fcfaf6] px-4 py-4">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-gold shadow-sm">
                          <Icon className="h-4.5 w-4.5" />
                        </span>
                        <div>
                          <p className="text-xs uppercase tracking-[0.28em] text-gold">{point.label}</p>
                          <p className="mt-1 text-sm font-medium text-charcoal-700">{point.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </header>

          <div className="page-card p-6 md:p-8">
            <p className="page-eyebrow">What to expect</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {[
                'Prompt response for order and sizing questions.',
                'Help with gifts, custom orders, and special requests.',
                'A simple, respectful contact flow that works on mobile.',
              ].map((item) => (
                <div key={item} className="rounded-[1.25rem] border border-[#eadfca] bg-[#fcfaf6] p-4 text-sm leading-7 text-muted">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ContactPage;