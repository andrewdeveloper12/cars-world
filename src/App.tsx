import { useState, useEffect } from 'react';
import './App.css';

interface Car {
  id: number;
  name: string;
  type: string;
  year: number;
  price: number;
  image: string;
  hp?: number;
  acceleration?: string;
  topSpeed?: string;
}

interface CartItem extends Car {
  quantity: number;
}

function App() {
  const [cars, setCars] = useState<Car[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // التنقل بين الصفحات
  const [currentPage, setCurrentPage] = useState<'home' | 'showroom' | 'details' | 'about'>('home');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  // السلة والدفع
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

  // جلب البيانات من السيرفر
  useEffect(() => {
    fetch('http://localhost:5000/api/cars')
      .then((res) => res.json())
      .then((data) => {
        const formattedData = data.map((car: any) => ({
          ...car,
          price: typeof car.price === 'string' 
            ? parseFloat(car.price.replace(/[^0-9.-]+/g, '')) 
            : car.price,
          hp: car.hp || Math.floor(450 + Math.random() * 300),
          acceleration: car.acceleration || (3.0 + Math.random() * 1.2).toFixed(1) + 's',
          topSpeed: car.topSpeed || Math.floor(280 + Math.random() * 60) + ' km/h',
        }));
        setCars(formattedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching cars:', err);
        setLoading(false);
      });
  }, []);

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
    const matchesSearch = car.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || car.type === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="app">
      {/* Navbar */}
      <header className="navbar">
        <a href="#" className="brand" onClick={() => setCurrentPage('home')}>
          KARL<span>ZOLT</span>
        </a>

        <nav className="nav-links">
          <button 
            className={currentPage === 'home' ? 'active' : ''} 
            onClick={() => setCurrentPage('home')}
          >
            Home
          </button>
          <button 
            className={currentPage === 'showroom' ? 'active' : ''} 
            onClick={() => setCurrentPage('showroom')}
          >
            Showroom
          </button>
          <button 
            className={currentPage === 'about' ? 'active' : ''} 
            onClick={() => setCurrentPage('about')}
          >
            About Us
          </button>
        </nav>

        <div className="header-actions">
          <button className="cart-badge-btn" onClick={() => setIsCartOpen(true)}>
            🛒 <span className="cart-count">{cart.reduce((a, b) => a + b.quantity, 0)}</span>
          </button>
          <button className="nav-button" onClick={() => setCurrentPage('showroom')}>
            Explore Cars ↗
          </button>
        </div>
      </header>

      {/* Main Pages Navigation */}
      <main className="main-content">
        {currentPage === 'home' && (
          <div className="page-fade-in">
            <section className="hero">
              <div className="hero-content">
                <span className="eyebrow">PREMIUM AUTOMOTIVE EXPERIENCE</span>
                <h1>THE FUTURE OF<br /><span>SUPER CARS.</span></h1>
                <p>
                  Discover and reserve the finest hypercars and luxury vehicles with instant online credit card booking.
                </p>
                <div className="hero-buttons">
                  <button className="primary-btn" onClick={() => setCurrentPage('showroom')}>
                    Browse Showroom 🏎️
                  </button>
                  <button className="secondary-btn" onClick={() => setCurrentPage('about')}>
                    Learn More
                  </button>
                </div>
                <div className="hero-stats">
                  <div><strong>500+</strong><small>Exclusive Vehicles</small></div>
                  <div><strong>100%</strong><small>Online Booking</small></div>
                  <div><strong>24/7</strong><small>VIP Concierge</small></div>
                </div>
              </div>

              <div className="hero-image">
                <img
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=90"
                  alt="Porsche 911"
                />
                <div className="image-label">KARL ZOLT EDITION</div>
              </div>
            </section>
          </div>
        )}

        {currentPage === 'showroom' && (
          <div className="page-fade-in">
            <section className="categories">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">SELECT CATEGORY</span>
                  <h2>Browse Fleet</h2>
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
                  <span className="eyebrow">HANDPICKED VEHICLES</span>
                  <h2>Available Cars</h2>
                </div>
                <span className="car-count">{filteredCars.length} VEHICLES</span>
              </div>

              <div className="search-box">
                <span>🔍</span>
                <input
                  type="text"
                  placeholder="Search BMW, Porsche, Audi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {loading ? (
                <p className="empty-message">Connecting to Karl Zolt Server...</p>
              ) : (
                <div className="car-grid">
                  {filteredCars.map((car) => (
                    <article className="car-card" key={car.id}>
                      <div className="car-image" onClick={() => openCarDetails(car)}>
                        <img src={car.image} alt={car.name} />
                        <span className="car-type">{car.type}</span>
                      </div>
                      <div className="car-info">
                        <div className="car-year">{car.year} EDITION</div>
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
                <span className="eyebrow">{selectedCar.year} MODEL</span>
                <h1>{selectedCar.name}</h1>
                <p className="description" style={{ color: 'var(--text-muted)', marginTop: '10px' }}>
                  Experience unmatched performance and luxury with the {selectedCar.name}. Built with precision engineering, designed to dominate the road.
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
                    <small style={{ color: 'var(--text-muted)' }}>Reservation Price</small>
                    <h2 style={{ fontSize: '1.8rem', color: '#fff' }}>${selectedCar.price.toLocaleString()}</h2>
                  </div>
                  <button className="checkout-btn" style={{ width: 'auto', padding: '12px 24px' }} onClick={() => addToCart(selectedCar)}>
                    Reserve This Vehicle 💳
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'about' && (
          <div className="page-fade-in about-page" style={{ padding: '60px' }}>
            <span className="eyebrow">ABOUT KARL ZOLT</span>
            <h1>REDEFINING AUTOMOTIVE<br /><span>EXCELLENCE.</span></h1>
            <p className="about-text" style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '20px auto' }}>
              Karl Zolt is an exclusive platform dedicated to luxury car enthusiasts. We bridge the gap between world-class engineering and seamless digital reservation.
            </p>

            <div className="about-features">
              <div className="feature-card">
                <h3>🏎️ Curated Fleet</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>Every vehicle undergoes rigorous quality inspection.</p>
              </div>
              <div className="feature-card">
                <h3>🔒 Secure Online Deposit</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>Reserve your dream car instantly using online checkout.</p>
              </div>
              <div className="feature-card">
                <h3>🌐 Worldwide Delivery</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>White-glove delivery straight to your private residence.</p>
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
              <h3>Your Cart 🛒</h3>
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
                      <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>
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
                    Proceed to Credit Card Payment 💳
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
              <h3>Credit Card Payment 🔒</h3>
              <button onClick={() => setIsCheckoutOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleCheckout} className="checkout-form">
              <div className="card-preview">
                <div className="card-type" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>VISA / MASTERCARD</div>
                <div className="card-number-display">
                  {cardData.cardNumber || '•••• •••• •••• ••••'}
                </div>
                <div className="card-footer-display">
                  <span>{cardData.name || 'YOUR NAME'}</span>
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
                Confirm & Complete Payment 🚀
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
            <h2>Reservation Confirmed!</h2>
            <p style={{ color: 'var(--text-muted)', margin: '10px 0' }}>Your simulated credit card transaction was processed successfully.</p>
            <div className="order-id">
              Order Reference ID: <strong>{orderId}</strong>
            </div>
            <button 
              className="primary-btn"
              onClick={() => {
                setOrderSuccess(false);
                setCurrentPage('showroom');
              }}
            >
              Return to Showroom
            </button>
          </div>
        </div>
      )}

      <footer>
        <a href="#" className="brand">KARL<span>ZOLT</span></a>
        <p>© 2026 Karl Zolt World. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;