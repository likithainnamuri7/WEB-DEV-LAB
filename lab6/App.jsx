import React, { useState } from "react";
import { Link, Routes, Route } from "react-router-dom";

const menuData = {
  "About Us": [
    ["Vision & Mission", "/about/vision-mission"],
    ["Leadership", "/about/leadership"],
    ["Departments", "/about/departments"],
  ],
  Academics: [
    ["Undergraduate", "/academics/undergraduate"],
    ["Postgraduate", "/academics/postgraduate"],
    ["PhD Programs", "/academics/phd"],
  ],
  Admissions: [
    ["Eligibility", "/admissions/eligibility"],
    ["Application Process", "/admissions/application-process"],
    ["Important Dates", "/admissions/important-dates"],
  ],
  Research: [
    ["Research Areas", "/research/areas"],
    ["Publications", "/research/publications"],
  ],
};

function Dropdown({ title, items }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="dropdown"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="nav-button">
        {title} <span>⌄</span>
      </button>

      {open && (
        <div className="dropdown-menu">
          {items.map(([name, path]) => (
            <Link
              key={path}
              to={path}
              className="dropdown-item"
              onClick={() => setOpen(false)}
            >
              {name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Header() {
  return (
    <>
      <div className="top-bar">
        <div>Welcome to University of Excellence</div>

        <div className="top-links">
          <span>Students</span>
          <span>Faculty & Staff</span>
          <span>Alumni</span>
          <span>Library</span>
        </div>
      </div>

      <header className="header">
        <Link to="/" className="brand">
          <div className="logo">
            UE
          </div>

          <div>
            <h1>UNIVERSITY</h1>
            <p>OF EXCELLENCE</p>
          </div>
        </Link>

        <div className="header-info">
          <div>
            <strong>Admissions Open</strong>
            <small>2026–27 Academic Year</small>
          </div>

          <Link to="/admissions/application-process" className="apply-btn">
            Apply Now
          </Link>
        </div>
      </header>

      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="home-link">
            Home
          </Link>

          {Object.entries(menuData).map(([title, items]) => (
            <Dropdown
              key={title}
              title={title}
              items={items}
            />
          ))}

          <Link to="/campus-life" className="nav-link">
            Campus Life
          </Link>

          <Link to="/placements" className="nav-link">
            Placements
          </Link>

          <Link to="/contact" className="nav-link">
            Contact Us
          </Link>

          <div className="search">⌕</div>
        </div>
      </nav>
    </>
  );
}

function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <div className="hero-tag">
            ESTABLISHED 1998 • ACADEMIC EXCELLENCE
          </div>

          <h2>
            Inspiring Minds.
            <br />
            <span>Shaping the Future.</span>
          </h2>

          <p>
            A leading institution committed to academic excellence,
            innovation, research and the holistic development of
            future leaders.
          </p>

          <div className="hero-buttons">
            <Link to="/academics/undergraduate" className="primary-btn">
              Explore Programs →
            </Link>

            <Link to="/about/vision-mission" className="secondary-btn">
              Discover University
            </Link>
          </div>
        </div>
      </section>

      <section className="quick-section">
        <div className="quick-card">
          <div className="quick-icon">🎓</div>
          <div>
            <h3>Academic Programs</h3>
            <p>Explore undergraduate, postgraduate and PhD programs.</p>
          </div>
          <span>→</span>
        </div>

        <div className="quick-card">
          <div className="quick-icon">📝</div>
          <div>
            <h3>Admissions 2026–27</h3>
            <p>Begin your journey towards academic excellence.</p>
          </div>
          <span>→</span>
        </div>

        <div className="quick-card">
          <div className="quick-icon">🔬</div>
          <div>
            <h3>Research & Innovation</h3>
            <p>Discover our research initiatives and achievements.</p>
          </div>
          <span>→</span>
        </div>
      </section>

      <section className="about-section">
        <div className="about-image">
          <div className="image-placeholder">
            UNIVERSITY
            <span>EXCELLENCE • KNOWLEDGE • INNOVATION</span>
          </div>
        </div>

        <div className="about-content">
          <div className="section-label">ABOUT THE UNIVERSITY</div>

          <h2>
            Building a better future
            <br />
            through <span>education.</span>
          </h2>

          <p>
            University of Excellence is a distinguished institution
            dedicated to creating an environment where knowledge,
            creativity and innovation flourish.
          </p>

          <p>
            Our students learn from accomplished faculty, engage in
            meaningful research and develop the skills required to
            make a positive impact on society.
          </p>

          <Link to="/about/vision-mission" className="text-btn">
            Learn More About Us →
          </Link>
        </div>
      </section>

      <section className="stats">
        <div>
          <strong>25+</strong>
          <span>Years of Excellence</span>
        </div>

        <div>
          <strong>15,000+</strong>
          <span>Students</span>
        </div>

        <div>
          <strong>500+</strong>
          <span>Faculty Members</span>
        </div>

        <div>
          <strong>95%</strong>
          <span>Placement Rate</span>
        </div>
      </section>

      <section className="program-section">
        <div className="section-heading">
          <div className="section-label">ACADEMICS</div>
          <h2>Discover Your <span>Potential</span></h2>
          <p>
            Choose from a wide range of programs designed to prepare
            you for a successful future.
          </p>
        </div>

        <div className="program-grid">
          <Link to="/academics/undergraduate" className="program-card">
            <span>01</span>
            <h3>Undergraduate</h3>
            <p>
              Build a strong foundation with our diverse undergraduate
              programs.
            </p>
            <b>Explore →</b>
          </Link>

          <Link to="/academics/postgraduate" className="program-card">
            <span>02</span>
            <h3>Postgraduate</h3>
            <p>
              Advance your knowledge through specialized master's
              programs.
            </p>
            <b>Explore →</b>
          </Link>

          <Link to="/academics/phd" className="program-card">
            <span>03</span>
            <h3>PhD & Research</h3>
            <p>
              Pursue advanced research and contribute to new knowledge.
            </p>
            <b>Explore →</b>
          </Link>
        </div>
      </section>

      <section className="notice-section">
        <div className="notice-title">
          <div className="section-label">LATEST UPDATES</div>
          <h2>News & Announcements</h2>
        </div>

        <div className="notice-list">
          <div className="notice">
            <div className="date">
              <strong>17</strong>
              <span>AUG</span>
            </div>

            <div>
              <small>ADMISSIONS</small>
              <h3>Applications open for Academic Year 2026–27</h3>
              <p>
                Apply now for undergraduate and postgraduate programs.
              </p>
            </div>
          </div>

          <div className="notice">
            <div className="date">
              <strong>12</strong>
              <span>AUG</span>
            </div>

            <div>
              <small>RESEARCH</small>
              <h3>University research teams receive major grants</h3>
              <p>
                Our researchers continue to make an impact across
                multiple disciplines.
              </p>
            </div>
          </div>

          <div className="notice">
            <div className="date">
              <strong>05</strong>
              <span>AUG</span>
            </div>

            <div>
              <small>CAMPUS</small>
              <h3>New student innovation centre inaugurated</h3>
              <p>
                A new space for collaboration, creativity and innovation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function InnerPage({ title, subtitle }) {
  return (
    <section className="inner-page">
      <div className="inner-hero">
        <div className="section-label">UNIVERSITY OF EXCELLENCE</div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      <div className="inner-content">
        <h2>{title}</h2>
        <p>
          Welcome to the {title} section of University of Excellence.
          Explore information, opportunities and resources available
          to our university community.
        </p>

        <Link to="/" className="primary-btn">
          ← Back to Home
        </Link>
      </div>
    </section>
  );
}

function App() {
  return (
    <div className="site">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/about/vision-mission"
          element={
            <InnerPage
              title="Vision & Mission"
              subtitle="Our purpose, values and aspirations."
            />
          }
        />

        <Route
          path="/about/leadership"
          element={
            <InnerPage
              title="Leadership"
              subtitle="Meet the leaders shaping our university."
            />
          }
        />

        <Route
          path="/about/departments"
          element={
            <InnerPage
              title="Departments"
              subtitle="Explore our academic departments."
            />
          }
        />

        <Route
          path="/academics/undergraduate"
          element={
            <InnerPage
              title="Undergraduate Programs"
              subtitle="Begin your journey towards academic excellence."
            />
          }
        />

        <Route
          path="/academics/postgraduate"
          element={
            <InnerPage
              title="Postgraduate Programs"
              subtitle="Deepen your expertise and advance your career."
            />
          }
        />

        <Route
          path="/academics/phd"
          element={
            <InnerPage
              title="PhD & Research"
              subtitle="Create knowledge that makes a difference."
            />
          }
        />

        <Route
          path="/admissions/eligibility"
          element={
            <InnerPage
              title="Eligibility"
              subtitle="Understand admission requirements."
            />
          }
        />

        <Route
          path="/admissions/application-process"
          element={
            <InnerPage
              title="Application Process"
              subtitle="Take the first step towards your future."
            />
          }
        />

        <Route
          path="/admissions/important-dates"
          element={
            <InnerPage
              title="Important Dates"
              subtitle="Stay updated with admission deadlines."
            />
          }
        />

        <Route
          path="/research/areas"
          element={
            <InnerPage
              title="Research Areas"
              subtitle="Explore our areas of research and innovation."
            />
          }
        />

        <Route
          path="/research/publications"
          element={
            <InnerPage
              title="Publications"
              subtitle="Discover research from our academic community."
            />
          }
        />

        <Route
          path="/campus-life"
          element={
            <InnerPage
              title="Campus Life"
              subtitle="Experience a vibrant and inclusive campus."
            />
          }
        />

        <Route
          path="/placements"
          element={
            <InnerPage
              title="Placements"
              subtitle="Connect your education with exciting careers."
            />
          }
        />

        <Route
          path="/contact"
          element={
            <InnerPage
              title="Contact Us"
              subtitle="We are here to help and answer your questions."
            />
          }
        />
      </Routes>

      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-logo">UE</div>
            <h2>UNIVERSITY OF EXCELLENCE</h2>
            <p>
              Knowledge • Innovation • Excellence
            </p>
          </div>

          <div>
            <h3>Quick Links</h3>
            <Link to="/about/vision-mission">About Us</Link>
            <Link to="/academics/undergraduate">Academics</Link>
            <Link to="/admissions/application-process">Admissions</Link>
            <Link to="/research/areas">Research</Link>
          </div>

          <div>
            <h3>Campus</h3>
            <Link to="/campus-life">Campus Life</Link>
            <Link to="/placements">Placements</Link>
            <Link to="/contact">Contact Us</Link>
          </div>

          <div className="footer-contact">
            <h3>Contact</h3>
            <p>University Avenue, Knowledge City</p>
            <p>+91 98765 43210</p>
            <p>info@university.edu</p>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 University of Excellence. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;