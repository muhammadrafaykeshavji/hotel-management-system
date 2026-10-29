import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5001';

const CATEGORY_TAGS = {
  dining: 'Meal With Us',
  wellness: 'Stay in Great Shape',
  business: 'We Find Happiness',
  recreation: 'Recreation & Fun',
  transport: 'At Your Service',
  other: 'Discover More',
};

// Only real guest routes — dead paths used to bounce to /home via catch-all
const CATEGORY_LINKS = {
  dining: '/restaurant',
  wellness: '/services',
  business: '/services',
  recreation: '/services',
  transport: '/services',
  other: '/services',
};

export default function ServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BASE_URL}/api/hotel-services/active`)
      .then(res => res.json())
      .then(data => { setServices(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <section className="section">
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    </section>
  );

  // sirf pehli 2 services show karo
  const displayServices = Array.isArray(services) ? services.slice(0, 2) : [];

  return (
    <section className="section">
      <div className="container">

        {/* Heading */}
        <div className="mx-auto text-center mb-5">
          <p className="wow fadeInUp">
            <span className="text-3 text-uppercase fw-600 rounded-pill border border-dark border-opacity-10 px-3 py-1">
              Services
            </span>
          </p>
          <h2 className="heading-font-family text-13 fw-600 lh-sm wow fadeInUp" data-wow-delay=".2s">
            We provide <span className="text-primary">Top Class <br className="d-none d-md-block" />Facility</span> for You
          </h2>
        </div>

        {/* Services List — sirf 2 */}
        {displayServices.map((item, index) => {
          const imageFirst = index % 2 === 0;
          const imageUrl = item.image ? `${BASE_URL}${item.image}` : null;
          const tag = CATEGORY_TAGS[item.category] || 'Discover More';
          const link = CATEGORY_LINKS[item.category] || '/services';

          return (
            <div
              key={item._id}
              className={`row gx-5 gy-4 gy-lg-5 ${index < displayServices.length - 1 ? 'mb-5' : ''}`}
            >
              {/* Image — click to open page */}
              <div
                className={`col-lg-6 text-center wow fadeInLeft ${!imageFirst ? 'order-1 order-lg-2' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(link)}
              >
                {imageUrl ? (
                  <img
                    className="img-fluid rounded-5"
                    src={imageUrl}
                    alt={item.name}
                    style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="rounded-5 d-flex align-items-center justify-content-center bg-light"
                    style={{ width: '100%', height: '400px' }}
                  >
                    <i className="fa-solid fa-image fa-3x text-muted opacity-25" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className={`col-lg-6 align-content-center wow fadeInRight ${!imageFirst ? 'order-2 order-lg-1' : ''}`}>
                <p>
                  <span className="d-inline-flex text-2 text-uppercase fw-500 rounded-pill border border-dark border-opacity-10 px-3">
                    {tag}
                  </span>
                </p>
                <h3
                  className="heading-font-family text-8 fw-600"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(link)}
                >
                  {item.name}
                </h3>
                <p className="text-3 text-body-secondary mt-2 mb-3">{item.description}</p>

                {/* Timing, Category & Price badges */}
                {(item.timing || item.price || item.category) && (
                  <div className="d-flex flex-wrap gap-2 mb-4">
                    {item.category && (
                      <span className="rounded-pill border border-dark border-opacity-10 px-3 py-1 text-2 text-muted">
                        <i className="fa-solid fa-layer-group me-1" />
                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                      </span>
                    )}
                    {item.timing && (
                      <span className="rounded-pill border border-dark border-opacity-10 px-3 py-1 text-2 text-muted">
                        <i className="fa-regular fa-clock me-1" />
                        {item.timing}
                      </span>
                    )}
                    {item.price && (
                      <span className="rounded-pill border border-dark border-opacity-10 px-3 py-1 text-2 text-muted">
                        <i className="fa-solid fa-tag me-1" />
                        {item.price}
                      </span>
                    )}
                  </div>
                )}
{/* 
                <a className="btn btn-new btn-primary rounded-pill" href={link}>
                  <span className="btn-text"><span>Read More</span></span>
                  <span className="btn-icon"><i className="fa-solid fa-arrow-right" /></span>
                </a> */}
              </div>
            </div>
          );
        })}

        {/* More Services Button */}
        {services.length > 2 && (
          <div className="text-center mt-5 wow fadeInUp">
            <p className="text-3 text-body-secondary mb-3">
              And <strong>{services.length - 2}</strong> more services available
            </p>
            <Link className="btn btn-new btn-outline-primary rounded-pill px-5" to="/services">
              <span className="btn-text"><span>View All Services</span></span>
              <span className="btn-icon"><i className="fa-solid fa-arrow-right" /></span>
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}