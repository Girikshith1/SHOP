import React, { useState } from 'react';
import { BRAND } from '../config/brand';
import { useToast } from '../context/ToastContext';
import { Mail, Phone, MapPin, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import './ContactPage.css';

interface ContactPageProps {
  navigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = () => {
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'DROP INQUIRY',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('MESSAGE DISPATCHED', 'Streetwear concierge will respond within 4 hours', 'success');
  };

  return (
    <div className="contact-page bg-almost-black">
      <div className="contact-hero-banner">
        <div className="container">
          <span className="mono-tag text-burnt-red">CLIENTELE CONCIERGE & ATELIER</span>
          <h1 className="contact-hero-title">CONTACT & CONCIERGE</h1>
          <p className="contact-hero-desc">
            Direct communication protocol with the DON Mumbai design headquarters. For styling consultations, order queries, press loans, and studio appointments.
          </p>
        </div>
      </div>

      <div className="container contact-body-grid">
        {/* Left: Studio & Concierge Information */}
        <div className="contact-info-col">
          <div className="contact-card">
            <span className="mono-tag">DIRECT PROTOCOLS</span>
            
            <div className="contact-row-item">
              <Mail size={18} className="contact-icon" />
              <div>
                <span className="c-label">ELECTRONIC DISPATCH</span>
                <a href={`mailto:${BRAND.contact.email}`} className="c-val">
                  {BRAND.contact.email}
                </a>
              </div>
            </div>

            <div className="contact-row-item">
              <Phone size={18} className="contact-icon" />
              <div>
                <span className="c-label">TELEPHONE / WHATSAPP CONCIERGE</span>
                <a href={`tel:${BRAND.contact.phone}`} className="c-val">
                  {BRAND.contact.phone}
                </a>
              </div>
            </div>

            <div className="contact-row-item">
              <Clock size={18} className="contact-icon" />
              <div>
                <span className="c-label">OPERATING TIMELINE</span>
                <span className="c-val-text">{BRAND.contact.conciergeHours}</span>
              </div>
            </div>

            <div className="contact-row-item">
              <MapPin size={18} className="contact-icon" />
              <div>
                <span className="c-label">MUMBAI STUDIO & SHOWROOM</span>
                <span className="c-val-text">{BRAND.contact.showroom}</span>
                <span className="c-subnote">Private appointments strictly reserved for Inner Circle members.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Message Dispatch Form */}
        <div className="contact-form-col">
          <div className="contact-form-card">
            <span className="mono-tag">TRANSMIT INQUIRY</span>
            <h3 className="contact-form-title">SEND A MESSAGE</h3>

            {submitted ? (
              <div className="contact-success-state fade-in">
                <CheckCircle2 size={44} className="text-success" />
                <h4>TRANSMISSION RECEIVED</h4>
                <p>Your inquiry has been allocated to a concierge specialist. Expect direct communication within 4 hours.</p>
                <button className="btn btn-outline-light btn-sm" onClick={() => setSubmitted(false)}>
                  TRANSMIT ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-inputs-stack">
                <div className="form-group">
                  <label className="form-label">YOUR FULL NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    placeholder="Aarav Sharma"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">YOUR EMAIL ADDRESS</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                    placeholder="name@example.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">INQUIRY SUBJECT</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="form-input"
                  >
                    <option value="DROP INQUIRY">DROP 001 ALLOCATION QUERY</option>
                    <option value="ORDER STATUS">EXISTING ORDER & DISPATCH STATUS</option>
                    <option value="SIZE EXCHANGE">7-DAY SIZE EXCHANGE REQUEST</option>
                    <option value="PRESS & VIP">EDITORIAL & VIP STYLING</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">MESSAGE</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-input"
                    placeholder="Describe your inquiry..."
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-full">
                  <span>DISPATCH INQUIRY</span>
                  <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
