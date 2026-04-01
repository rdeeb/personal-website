import React from 'react';
import Panel from './Panel/Panel';
import { User } from 'pixelarticons/react/User';
import { Zap } from 'pixelarticons/react/Zap';
import { Heart } from 'pixelarticons/react/Heart';
import heroImg from '../assets/hero_img.jpg';
import aboutData from '../content/about.json';

const AboutPage = () => {
  return (
    <div className="about-page-container">
      <header className="about-page-header">
        <h1>About Me</h1>
        <p>A little bit about who I am and what I do.</p>
      </header>

      <div className="about-content">
        <section className="about-intro">
          <Panel title="Hello, I'm Ramy!" icon={<User size={16} />} client:load>
            <div className="hero-content">
              <img alt="Ramy's profile picture" src={heroImg.src} className="profile-picture" />
              <div className="hero-text">
                <p>{aboutData.bio}</p>
              </div>
            </div>
          </Panel>
        </section>

        <div className="about-grid">
          <section className="about-achievements">
            <Panel title="Key Achievements" icon={<Zap size={16} />} client:load>
              <ul className="about-list">
                {aboutData.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </Panel>
          </section>

          <section className="about-interests">
            <Panel title="Interests & Hobbies" icon={<Heart size={16} />} client:load>
              <ul className="about-list">
                {aboutData.interests.map((interest, index) => (
                  <li key={index}>{interest}</li>
                ))}
              </ul>
            </Panel>
          </section>
        </div>
      </div>

      <style>{`
        .about-page-header {
          margin-bottom: 3rem;
          text-align: center;
        }
        
        .about-page-header h1 {
          font-size: 3rem;
          margin-bottom: 0.5rem;
          color: var(--black);
          text-shadow: 2px 2px 0 var(--interface-border-light);
        }

        .about-page-header p {
          font-size: 1.2rem;
          color: var(--interface-text);
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 20px;
        }

        .about-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .about-list li {
          padding: 8px 0;
          border-bottom: 1px dashed var(--interface-border-light);
          color: var(--interface-text);
        }

        .about-list li:last-child {
          border-bottom: none;
        }

        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutPage;
