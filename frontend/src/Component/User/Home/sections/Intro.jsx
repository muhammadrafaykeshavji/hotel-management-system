import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { getHotelCities } from '../../../../api/hotelApi';
import { loadStaySearch, saveStaySearch } from '../../../../utils/staySearch';

export default function Intro() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [cities, setCities] = useState([]);
  const [destination, setDestination] = useState(() => loadStaySearch().city || '');
  const [checkIn, setCheckIn] = useState(() => loadStaySearch().checkIn || '');
  const [checkOut, setCheckOut] = useState(() => loadStaySearch().checkOut || '');
  const [guests, setGuests] = useState(() => loadStaySearch().guests || '2');
  const [rooms, setRooms] = useState(() => loadStaySearch().rooms || '1');

  const today = new Date().toISOString().split('T')[0];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.14]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.35]);

  useEffect(() => {
    getHotelCities()
      .then((data) => setCities(data || []))
      .catch(() =>
        setCities([
          'Karachi',
          'Lahore',
          'Islamabad',
          'Bhurban',
          'Gwadar',
          'Malam Jabba',
        ])
      );
  }, []);

  const handleCheckInChange = (e) => {
    const val = e.target.value;
    setCheckIn(val);
    if (!checkOut || checkOut <= val) {
      const nextDay = new Date(val);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOut(nextDay.toISOString().split('T')[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      alert('Please select both check-in and check-out dates.');
      return;
    }
    if (checkOut <= checkIn) {
      alert('Check-out must be after check-in.');
      return;
    }
    const stay = {
      city: destination || '',
      checkIn,
      checkOut,
      guests: guests || '2',
      rooms: rooms || '1',
    };
    saveStaySearch(stay);

    const query = new URLSearchParams();
    if (destination) query.set('city', destination);
    query.set('checkIn', checkIn);
    query.set('checkOut', checkOut);
    if (guests) query.set('guests', guests);
    if (rooms) query.set('rooms', rooms);

    navigate(`/hotels?${query.toString()}`);
  };

  return (
    <section
      ref={sectionRef}
      className="position-relative d-flex flex-column justify-content-between"
      style={{
        minHeight: '92vh',
        padding: '5rem 0 3.5rem',
        overflow: 'hidden',
        background: 'var(--color-primary, #171A17)',
      }}
    >
      {/* Edge-to-edge cinematic background with parallax depth */}
      <motion.div
        className="ls-hero-parallax-bg"
        style={{
          position: 'absolute',
          inset: '-8% 0 0 0',
          backgroundImage:
            "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=85')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1,
          y: reduceMotion ? 0 : bgY,
          scale: reduceMotion ? 1.02 : bgScale,
        }}
      />

      {/* Charcoal vignette — keeps brand contrast */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(23, 26, 23, 0.52) 0%, rgba(23, 26, 23, 0.70) 55%, rgba(23, 26, 23, 0.94) 100%)',
          zIndex: 2,
        }}
      />

      {/* Soft gold light wash for depth (not glow spam) */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 70% 45% at 50% 28%, rgba(184,155,98,0.14), transparent 70%)',
        }}
      />

      <motion.div
        className="container position-relative py-4 my-auto"
        style={{
          zIndex: 3,
          y: reduceMotion ? 0 : contentY,
          opacity: reduceMotion ? 1 : contentOpacity,
        }}
      >
        <motion.div
          className="text-center text-white mx-auto"
          style={{ maxWidth: '860px' }}
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-3 d-flex flex-wrap justify-content-center gap-2">
            <span
              className="d-inline-flex align-items-center gap-2 px-3 py-1"
              style={{
                background: 'rgba(183, 154, 99, 0.18)',
                border: '1px solid rgba(183, 154, 99, 0.5)',
                color: 'var(--color-accent, #B79A63)',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                borderRadius: 2,
              }}
            >
              <i className="fa-solid fa-crown" style={{ fontSize: '0.72rem' }}></i>
              AN EXCEPTIONAL STAY
            </span>
            <span className="ls-3d-badge">
              <i className="fa-solid fa-cube"></i> Immersive 3D UI
            </span>
          </div>

          <h1
            className="display-3 fw-bold mb-3"
            style={{
              fontFamily:
                'var(--font-heading, "Playfair Display", Georgia, serif)',
              fontSize: 'clamp(2.5rem, 5.2vw, 4.25rem)',
              color: '#FFFFFF',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              textShadow: '0 8px 28px rgba(0, 0, 0, 0.45)',
            }}
          >
            Exceptional Stays. Unforgettable Moments.
          </h1>

          <p
            className="lead mb-4 mx-auto"
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: 'clamp(1rem, 1.8vw, 1.18rem)',
              fontWeight: 300,
              maxWidth: '700px',
              lineHeight: 1.65,
            }}
          >
            Discover refined comfort, thoughtful hospitality, and memorable
            experiences across Pakistan’s most celebrated destinations.
          </p>

          <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 mb-4">
            <Link to="/room" className="text-decoration-none">
              <button
                className="ls-btn-primary"
                style={{
                  padding: '0.8rem 2.2rem',
                  fontSize: '0.9rem',
                  letterSpacing: '0.06em',
                  borderRadius: 'var(--radius-sm, 4px)',
                }}
              >
                <i className="fa-solid fa-door-open me-2"></i>
                Explore Our Rooms
              </button>
            </Link>

            <Link to="/about" className="text-decoration-none">
              <button
                className="ls-btn-outline"
                style={{
                  padding: '0.8rem 2.2rem',
                  fontSize: '0.9rem',
                  color: '#FFFFFF',
                  borderColor: 'rgba(255, 255, 255, 0.65)',
                  borderRadius: 'var(--radius-sm, 4px)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    'var(--color-accent, #B79A63)';
                  e.currentTarget.style.borderColor =
                    'var(--color-accent, #B79A63)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor =
                    'rgba(255, 255, 255, 0.65)';
                }}
              >
                <i className="fa-solid fa-circle-info me-2"></i>
                Discover LuxuryStay
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Floating booking panel — glass depth */}
        <motion.div
          id="hero-booking-panel"
          className="ls-search-engine ls-booking-glass mt-4"
          initial={reduceMotion ? false : { opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{
            maxWidth: '1160px',
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.96)',
            borderRadius: 'var(--radius-md, 10px)',
            padding: '1.5rem 1.75rem',
            border: '1px solid var(--color-border, #E7E2D8)',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <form onSubmit={handleSubmit}>
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-6 col-lg-3">
                <label className="ls-label d-flex align-items-center gap-1">
                  <i
                    className="fa-solid fa-location-dot"
                    style={{ color: 'var(--color-accent, #B79A63)' }}
                  ></i>
                  Destination / Hotel
                </label>
                <select
                  className="ls-select"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  style={{
                    borderRadius: 'var(--radius-sm, 4px)',
                    height: '46px',
                    fontWeight: 500,
                  }}
                >
                  <option value="">All Destinations (Pakistan)</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c} — LuxuryStay
                    </option>
                  ))}
                  {cities.length === 0 && (
                    <>
                      <option value="Karachi">Karachi — Flagship</option>
                      <option value="Lahore">Lahore — Grand Mall</option>
                      <option value="Islamabad">Islamabad — Margalla</option>
                      <option value="Bhurban">Bhurban — Alpine Resort</option>
                      <option value="Gwadar">Gwadar — Coastal Sanctuary</option>
                      <option value="Malam Jabba">
                        Malam Jabba — Ski Resort
                      </option>
                    </>
                  )}
                </select>
              </div>

              <div className="col-6 col-md-3 col-lg-2">
                <label className="ls-label d-flex align-items-center gap-1">
                  <i
                    className="fa-regular fa-calendar-check"
                    style={{ color: 'var(--color-accent, #B79A63)' }}
                  ></i>
                  Check-In
                </label>
                <input
                  type="date"
                  className="ls-input"
                  min={today}
                  value={checkIn}
                  onChange={handleCheckInChange}
                  required
                  style={{
                    borderRadius: 'var(--radius-sm, 4px)',
                    height: '46px',
                  }}
                />
              </div>

              <div className="col-6 col-md-3 col-lg-2">
                <label className="ls-label d-flex align-items-center gap-1">
                  <i
                    className="fa-regular fa-calendar-xmark"
                    style={{ color: 'var(--color-accent, #B79A63)' }}
                  ></i>
                  Check-Out
                </label>
                <input
                  type="date"
                  className="ls-input"
                  min={checkIn || today}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                  style={{
                    borderRadius: 'var(--radius-sm, 4px)',
                    height: '46px',
                  }}
                />
              </div>

              <div className="col-6 col-md-3 col-lg-1">
                <label className="ls-label d-flex align-items-center gap-1">
                  <i
                    className="fa-solid fa-user-group"
                    style={{ color: 'var(--color-accent, #B79A63)' }}
                  ></i>
                  Guests
                </label>
                <select
                  className="ls-select px-2"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  style={{
                    borderRadius: 'var(--radius-sm, 4px)',
                    height: '46px',
                    fontWeight: 500,
                  }}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </select>
              </div>

              <div className="col-6 col-md-3 col-lg-1">
                <label className="ls-label d-flex align-items-center gap-1">
                  <i
                    className="fa-solid fa-bed"
                    style={{ color: 'var(--color-accent, #B79A63)' }}
                  ></i>
                  Rooms
                </label>
                <select
                  className="ls-select px-2"
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                  style={{
                    borderRadius: 'var(--radius-sm, 4px)',
                    height: '46px',
                    fontWeight: 500,
                  }}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </select>
              </div>

              <div className="col-12 col-lg-3">
                <button
                  type="submit"
                  className="ls-btn-primary w-100"
                  style={{
                    height: '46px',
                    borderRadius: 'var(--radius-sm, 4px)',
                    fontSize: '0.88rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                  }}
                >
                  <i className="fa-solid fa-magnifying-glass me-2"></i>
                  Check Availability
                </button>
              </div>
            </div>
          </form>

          <div className="d-flex flex-wrap justify-content-center justify-content-md-between align-items-center gap-3 pt-3 mt-3 border-top border-light-subtle">
            <span
              className="d-inline-flex align-items-center gap-2"
              style={{
                fontSize: '0.76rem',
                color: 'var(--color-text-secondary, #77766F)',
                fontWeight: 500,
              }}
            >
              <i
                className="fa-solid fa-shield-check"
                style={{ color: 'var(--color-accent, #B79A63)' }}
              ></i>
              Best Rate Guarantee Direct
            </span>
            <span
              className="d-inline-flex align-items-center gap-2"
              style={{
                fontSize: '0.76rem',
                color: 'var(--color-text-secondary, #77766F)',
                fontWeight: 500,
              }}
            >
              <i
                className="fa-solid fa-wifi"
                style={{ color: 'var(--color-accent, #B79A63)' }}
              ></i>
              Complimentary High-Speed Wi-Fi
            </span>
            <span
              className="d-inline-flex align-items-center gap-2"
              style={{
                fontSize: '0.76rem',
                color: 'var(--color-text-secondary, #77766F)',
                fontWeight: 500,
              }}
            >
              <i
                className="fa-solid fa-arrow-rotate-left"
                style={{ color: 'var(--color-accent, #B79A63)' }}
              ></i>
              Flexible Free Cancellation
            </span>
            <span
              className="d-inline-flex align-items-center gap-2"
              style={{
                fontSize: '0.76rem',
                color: 'var(--color-text-secondary, #77766F)',
                fontWeight: 500,
              }}
            >
              <i
                className="fa-solid fa-bell-concierge"
                style={{ color: 'var(--color-accent, #B79A63)' }}
              ></i>
              24/7 Dedicated Concierge
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
