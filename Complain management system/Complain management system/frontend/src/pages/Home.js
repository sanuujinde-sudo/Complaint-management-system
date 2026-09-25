import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow hero-eyebrow">A CLEARER WAY TO BE HEARD</p>
          <h1>Turn every concern into visible progress.</h1>
          <p className="hero-copy">ComplaintSys gives people a simple place to raise concerns, follow every update, and help teams resolve issues with accountability.</p>
          <div className="hero-actions">
            <Link className="btn btn-light btn-lg" to="/login">Sign in to your workspace <span aria-hidden="true">-&gt;</span></Link>
            <Link className="hero-text-link" to="/register">Create an account</Link>
          </div>
        </div>
        <div className="hero-aside" aria-label="Complaint progress overview">
          <span className="hero-aside-label">Resolution, at a glance</span>
          <div className="hero-progress"><span style={{ width: '78%' }} /></div>
          <div className="hero-aside-row"><strong>78%</strong><span>cases moving forward</span></div>
          <div className="hero-note"><span>01</span><div><strong>Every update in one place</strong><small>Less chasing. More clarity.</small></div></div>
        </div>
      </section>

      <section className="home-intro">
        <div><p className="eyebrow">BUILT FOR FOLLOW-THROUGH</p><h2>A better complaint experience for everyone involved.</h2></div>
        <p className="home-intro-copy">From the first report to the final resolution, every step is organized, transparent, and easy to revisit.</p>
      </section>

      <section className="home-feature-grid">
        <article className="home-feature home-feature-primary"><span className="feature-number">01</span><h3>Report with confidence</h3><p>Share the details that matter and create a structured record your support team can act on.</p><Link to="/register">Start a report <span aria-hidden="true">-&gt;</span></Link></article>
        <article className="home-feature"><span className="feature-number">02</span><h3>Stay in the loop</h3><p>Track status changes and follow the conversation without searching through scattered messages.</p><span className="feature-caption">Live status updates</span></article>
        <article className="home-feature"><span className="feature-number">03</span><h3>Resolve with purpose</h3><p>Give teams the context they need to prioritize work and close the loop with care.</p><span className="feature-caption">Actionable case history</span></article>
      </section>

      <section className="home-audience">
        <div className="audience-heading"><p className="eyebrow">ONE PLATFORM, TWO PERSPECTIVES</p><h2>Designed for people and the teams supporting them.</h2></div>
        <div className="audience-list">
          <div className="audience-item"><span className="audience-icon">U</span><div><h3>For users</h3><p>Register issues, monitor progress, and share feedback after resolution.</p></div></div>
          <div className="audience-item"><span className="audience-icon audience-icon-dark">A</span><div><h3>For agents & admins</h3><p>Prioritize cases, coordinate responses, and measure how work gets resolved.</p></div></div>
        </div>
      </section>

      <section className="home-cta"><div><p className="eyebrow">READY WHEN YOU ARE</p><h2>Make the next step a productive one.</h2></div><Link className="btn btn-primary" to="/login">Open ComplaintSys <span aria-hidden="true">-&gt;</span></Link></section>
    </div>
  );
}
