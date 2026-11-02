import { useState } from 'react';
import './App.css';

interface Car {
  id: number;
  name: string;
  type: string;
  year: number;
  price: number;
  image: string;
  hp: number;
  acceleration: string;
  topSpeed: string;
}

interface CartItem extends Car {
  quantity: number;
}

// قاعدة بيانات عالمية ضخمة تشمل سيارات من جميع أنحاء العالم للبحث الشامل
const globalCarsDatabase: Car[] = [
  { id: 1, name: 'Porsche 911 GT3 RS', type: 'Sports', year: 2025, price: 225000, image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80', hp: 518, acceleration: '3.0s', topSpeed: '296 km/h' },
  { id: 2, name: 'Bugatti Chiron Super Sport', type: 'Sports', year: 2024, price: 3820000, image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80', hp: 1578, acceleration: '2.4s', topSpeed: '440 km/h' },
  { id: 3, name: 'Rolls-Royce Phantom Series II', type: 'Luxury', year: 2025, price: 460000, image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80', hp: 563, acceleration: '5.1s', topSpeed: '250 km/h' },
  { id: 4, name: 'Lamborghini Revuelto', type: 'Sports', year: 2025, price: 608000, image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=80', hp: 1001, acceleration: '2.5s', topSpeed: '350 km/h' },
  { id: 5, name: 'Ferrari SF90 Stradale', type: 'Sports', year: 2024, price: 524000, image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80', hp: 986, acceleration: '2.5s', topSpeed: '340 km/h' },
  { id: 6, name: 'Mercedes-AMG G 63 Mansory', type: 'SUV', year: 2025, price: 320000, image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=80', hp: 850, acceleration: '4.0s', topSpeed: '250 km/h' },
  { id: 7, name: 'Tesla Model S Plaid', type: 'Electric', year: 2025, price: 89000, image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80', hp: 1020, acceleration: '1.99s', topSpeed: '322 km/h' },
  { id: 8, name: 'Aston Martin Valkyrie', type: 'Sports', year: 2024, price: 3500000, image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80', hp: 1139, acceleration: '2.3s', topSpeed: '402 km/h' },
  { id: 9, name: 'Bentley Continental GT Speed', type: 'Luxury', year: 2025, price: 285000, image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80', hp: 650, acceleration: '3.5s', topSpeed: '335 km/h' },
  { id: 10, name: 'Range Rover SV Autobiography', type: 'SUV', year: 2025, price: 234000, image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80', hp: 523, acceleration: '4.4s', topSpeed: '261 km/h' },
  { id: 11, name: 'Rimac Nevera', type: 'Electric', year: 2024, price: 2100000, image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', hp: 1914, acceleration: '1.85s', topSpeed: '412 km/h' },
  { id: 12, name: 'BMW M4 Competition', type: 'Sports', year: 2025, price: 85000, image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', hp: 503, acceleration: '3.4s', topSpeed: '290 km/h' }
];

function App() {
  const [cars] = useState<Car[]>(globalCarsDatabase);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const [currentPage, setCurrentPage] = useState<'home' | 'showroom' | 'details' | 'about'>('home');
  const [selectedCar, setSelectedCar] = useState<Car | null>(globalCarsDatabase[0]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [cardData, setCardData] = useState({
    name: '',
    cardNumber: '',
    expDate: '',
    cvc: '',
  });

  const addToCart = (car: Car) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === car.id);
      if (existing) {
        return prev.map((item) =>
          item.id === car.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...car, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckoutOpen(false);
    setOrderSuccess(true);
    setOrderId('KZ-' + Math.floor(100000 + Math.random() * 900000));
    setCart([]);
  };

  const openCarDetails = (car: Car) => {
    setSelectedCar(car);
    setCurrentPage('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredCars = cars.filter((car) => {
    const matchesSearch = car.name.toLowerCase().includes(search.toLowerCase()) || 
                          car.type.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || car.type === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="app">
      <header className="navbar">
        <a href="#home" className="brand" onClick={() => setCurrentPage('home')}>
          KARL<span>ZOLT</span>
        </a>

        <nav className="nav-links">
          <button className={currentPage === 'home' ? 'active' : ''} onClick={() => setCurrentPage('home')}>Home</button>
          <button className={currentPage === 'showroom' ? 'active' : ''} onClick={() => setCurrentPage('showroom')}>Global Showroom</button>
          <button className={currentPage === 'about' ? 'active' : ''} onClick={() => setCurrentPage('about')}>About Us</button>
        </nav>

        <div className="header-actions">
          <button className="cart-badge-btn" onClick={() => setIsCartOpen(true)}>
            🛒 <span className="cart-count">{cart.reduce((a, b) => a + b.quantity, 0)}</span>
          </button>
          <button className="nav-button" onClick={() => setCurrentPage('showroom')}>
            Explore ↗
          </button>
        </div>
      </header>

      <main className="main-content">
        {currentPage === 'home' && (
          <div className="page-fade-in">
            <section className="hero">
              <div className="hero-content">
                <span className="eyebrow">GLOBAL AUTOMOTIVE DIRECTORY</span>
                <h1>THE WORLD'S FINEST<br /><span>SUPER CARS.</span></h1>
                <p>
                  Search and reserve legendary hypercars and luxury vehicles from across the globe with instant online secure booking.
                </p>
                <div className="hero-buttons">
                  <button className="primary-btn" onClick={() => setCurrentPage('showroom')}>
                    Global Showroom 🏎️
                  </button>
                  <button className="secondary-btn" onClick={() => setCurrentPage('about')}>
                    Learn More
                  </button>
                </div>
                <div className="hero-stats">
                  <div><strong>1,000+</strong><small>Global Brands</small></div>
                  <div><strong>100%</strong><small>Online Booking</small></div>
                  <div><strong>24/7</strong><small>Worldwide Delivery</small></div>
                </div>
              </div>

              <div className="hero-image">
                <img
                  src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80"
                  alt="Porsche 911 GT3"
                />
                <div className="image-label">GLOBAL EDITION</div>
              </div>
            </section>
          </div>
        )}

        {currentPage === 'showroom' && (
          <div className="page-fade-in">
            <section className="categories">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">WORLDWIDE FLEET SEARCH</span>
                  <h2>Global Categories</h2>
                </div>
              </div>

              <div className="category-list">
                {['All', 'Sports', 'Luxury', 'SUV', 'Electric'].map((item) => (
                  <button
                    key={item}
                    className={category === item ? 'category active' : 'category'}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </section>

            <section className="cars-section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">GLOBAL DATABASE</span>
                  <h2>Available Worldwide Vehicles</h2>
                </div>
                <span className="car-count">{filteredCars.length} VEHICLES FOUND</span>
              </div>

              <div className="search-box">
                <span>🌍</span>
                <input
                  type="text"
                  placeholder="Search any car worldwide (e.g. Bugatti, Porsche, Ferrari)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="car-grid">
                {filteredCars.map((car) => (
                  <article className="car-card" key={car.id}>
                    <div className="car-image" onClick={() => openCarDetails(car)}>
                      <img src={car.image} alt={car.name} />
                      <span className="car-type">{car.type}</span>
                    </div>
                    <div className="car-info">
                      <div className="car-year">{car.year} GLOBAL EDITION</div>
                      <h3 onClick={() => openCarDetails(car)}>{car.name}</h3>
                      
                      <div className="car-bottom">
                        <div className="car-bottom-row">
                          <small style={{ color: 'var(--text-muted)' }}>Price</small>
                          <strong>${car.price.toLocaleString()}</strong>
                        </div>
                        <div className="card-btn-group">
                          <button className="details-btn" onClick={() => openCarDetails(car)}>
                            Details 👁️
                          </button>
                          <button className="buy-btn" onClick={() => addToCart(car)}>
                            Reserve 💳
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {filteredCars.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
                  No vehicles found matching your worldwide search. Try typing another brand like "Bugatti" or "Rolls Royce".
                </p>
              )}
            </section>
          </div>
        )}

        {currentPage === 'details' && selectedCar && (
          <div className="page-fade-in details-page">
            <button className="back-btn" onClick={() => setCurrentPage('showroom')}>
              ← Back to Showroom
            </button>

            <div className="details-container">
              <div className="details-image-box">
                <img src={selectedCar.image} alt={selectedCar.name} />
              </div>

              <div className="details-info-box">
                <span className="eyebrow">{selectedCar.year} WORLDWIDE MODEL</span>
                <h1>{selectedCar.name}</h1>
                <p className="description" style={{ color: 'var(--text-muted)', marginTop: '10px' }}>
                  Engineered for peak global performance. The {selectedCar.name} delivers supreme luxury, unmatched aerodynamics, and breathtaking speed.
                </p>

                <div className="specs-grid">
                  <div className="spec-card">
                    <small>Horsepower</small>
                    <strong>{selectedCar.hp} HP</strong>
                  </div>
                  <div className="spec-card">
                    <small>0 - 100 km/h</small>
                    <strong>{selectedCar.acceleration}</strong>
                  </div>
                  <div className="spec-card">
                    <small>Top Speed</small>
                    <strong>{selectedCar.topSpeed}</strong>
                  </div>
                </div>

                <div className="details-price-row">
                  <div>
                    <small style={{ color: 'var(--text-muted)' }}>Global Reservation Price</small>
                    <h2 style={{ fontSize: '1.8rem', color: '#fff' }}>${selectedCar.price.toLocaleString()}</h2>
                  </div>
                  <button className="checkout-btn" style={{ width: 'auto', padding: '12px 24px' }} onClick={() => addToCart(selectedCar)}>
                    Reserve Worldwide 💳
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'about' && (
          <div className="page-fade-in about-page" style={{ padding: '60px', textAlign: 'center' }}>
            <span className="eyebrow">ABOUT KARL ZOLT GLOBAL</span>
            <h1>CONNECTING CAR LOVERS<br /><span>WORLDWIDE.</span></h1>
            <p className="about-text" style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '20px auto' }}>
              Karl Zolt is the premier international digital showroom, allowing enthusiasts to search, explore, and reserve the most elite vehicles across the globe instantly.
            </p>

            <div className="about-features" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '40px' }}>
              <div className="feature-card" style={{ background: 'var(--card-bg)', padding: '25px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <h3>🌍 Worldwide Database</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>Access hypercars and luxury cars manufactured globally.</p>
              </div>
              <div className="feature-card" style={{ background: 'var(--card-bg)', padding: '25px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <h3>🔒 Secure Global Deposit</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>Instant encrypted reservation through test checkout.</p>
              </div>
              <div className="feature-card" style={{ background: 'var(--card-bg)', padding: '25px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <h3>✈️ International Delivery</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>White-glove shipping directly to your home country.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="modal-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Your Global Cart 🛒</h3>
              <button onClick={() => setIsCartOpen(false)}>✕</button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart" style={{ padding: '20px 0', color: 'var(--text-muted)' }}><p>Your cart is empty.</p></div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <img src={item.image} alt={item.name} />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>${item.price.toLocaleString()} x {item.quantity}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4d' }}>🗑️</button>
                    </div>
                  ))}
                </div>
                <div className="cart-footer">
                  <div className="total">
                    <span>Total Amount:</span>
                    <strong>${totalPrice.toLocaleString()}</strong>
                  </div>
                  <button 
                    className="checkout-btn"
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                  >
                    Proceed to International Payment 💳
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="modal-overlay" onClick={() => setIsCheckoutOpen(false)}>
          <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>International Secure Payment 🔒</h3>
              <button onClick={() => setIsCheckoutOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleCheckout} className="checkout-form">
              <div className="card-preview">
                <div className="card-type" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>GLOBAL VISA / MASTERCARD</div>
                <div className="card-number-display">
                  {cardData.cardNumber || '•••• •••• •••• ••••'}
                </div>
                <div className="card-footer-display">
                  <span>{cardData.name || 'CARDHOLDER NAME'}</span>
                  <span>{cardData.expDate || 'MM/YY'}</span>
                </div>
              </div>

              <div className="form-group">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  required
                  placeholder="Andrew Zolt"
                  value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  required
                  maxLength={19}
                  placeholder="4532 1122 3344 5566"
                  value={cardData.cardNumber}
                  onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    required
                    placeholder="12/28"
                    maxLength={5}
                    value={cardData.expDate}
                    onChange={(e) => setCardData({ ...cardData, expDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>CVC / CVV</label>
                  <input
                    type="password"
                    required
                    maxLength={3}
                    placeholder="888"
                    value={cardData.cvc}
                    onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                  />
                </div>
              </div>

              <div className="checkout-summary" style={{ display: 'flex', justifyContent: 'space-between', margin: '15px 0' }}>
                <span>Total Amount:</span>
                <strong>${totalPrice.toLocaleString()}</strong>
              </div>

              <button type="submit" className="pay-now-btn">
                Confirm & Complete Order 🚀
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {orderSuccess && (
        <div className="modal-overlay">
          <div className="success-modal" style={{ textAlign: 'center' }}>
            <div className="success-icon" style={{ fontSize: '3rem', marginBottom: '10px' }}>🎉</div>
            <h2>Global Order Confirmed!</h2>
            <p style={{ color: 'var(--text-muted)', margin: '10px 0' }}>Your international credit card transaction was processed successfully.</p>
            <div className="order-id">
              Global Reference ID: <strong>{orderId}</strong>
            </div>
            <button 
              className="primary-btn"
              onClick={() => {
                setOrderSuccess(false);
                setCurrentPage('showroom');
              }}
            >
              Return to Global Showroom
            </button>
          </div>
        </div>
      )}

      <footer>
        <a href="#home" className="brand">KARL<span>ZOLT</span></a>
        <p>© 2026 Karl Zolt Global World. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;