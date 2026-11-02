import { useState, useMemo } from 'react';
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

// قائمة البراندات والموديلات الشاملة لإنشاء داتا ضخمة ديناميكياً
const BRANDS = [
  { name: 'Porsche', types: ['Sports', 'SUV', 'Electric'], basePrice: 120000, img: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80' },
  { name: 'BMW', types: ['Sports', 'Sedan', 'SUV'], basePrice: 65000, img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80' },
  { name: 'Mercedes-Benz', types: ['Luxury', 'SUV', 'Sports'], basePrice: 80000, img: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=800&q=80' },
  { name: 'Audi', types: ['Sports', 'Sedan', 'Electric'], basePrice: 60000, img: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80' },
  { name: 'Toyota', types: ['SUV', 'Sedan', 'Sports'], basePrice: 32000, img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80' },
  { name: 'Honda', types: ['Sedan', 'SUV', 'Sports'], basePrice: 28000, img: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80' },
  { name: 'Ford', types: ['SUV', 'Sports', 'Truck'], basePrice: 40000, img: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80' },
  { name: 'Ferrari', types: ['Sports'], basePrice: 350000, img: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80' },
  { name: 'Lamborghini', types: ['Sports', 'SUV'], basePrice: 300000, img: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80' },
  { name: 'Rolls-Royce', types: ['Luxury'], basePrice: 450000, img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80' },
  { name: 'Tesla', types: ['Electric', 'Sedan', 'SUV'], basePrice: 50000, img: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80' },
  { name: 'Nissan', types: ['Sports', 'SUV', 'Sedan'], basePrice: 30000, img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80' },
  { name: 'Hyundai', types: ['SUV', 'Sedan', 'Electric'], basePrice: 27000, img: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=80' },
  { name: 'Chevrolet', types: ['Sports', 'SUV'], basePrice: 38000, img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80' },
  { name: 'Bugatti', types: ['Sports'], basePrice: 3000000, img: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80' }
];

const MODEL_SUFFIXES = ['GT', 'Pro', 'Ultra', 'Sport', 'Competition', 'Edition', 'S', 'RS', 'Turbo', 'V8', 'Hybrid', 'EV', 'Line', 'Executive'];

// توليد قاعدة بيانات ضخمة تفوق 500+ سيارة تلقائياً لتغطي جميع الماركات والأنواع العالمية
const generateGlobalCars = (): Car[] => {
  const carsList: Car[] = [];
  let idCounter = 1;

  BRANDS.forEach((brand) => {
    brand.types.forEach((type) => {
      MODEL_SUFFIXES.forEach((suffix, index) => {
        const year = 2020 + (index % 6);
        const price = Math.round(brand.basePrice + (index * 4500) + (Math.random() * 2000));
        carsList.push({
          id: idCounter++,
          name: `${brand.name} ${type} ${suffix} ${100 + index * 5}`,
          type: type === 'Truck' ? 'SUV' : type,
          year: year,
          price: price,
          image: brand.img,
          hp: 200 + (index * 35) + Math.floor(Math.random() * 50),
          acceleration: (2.2 + (index * 0.2)).toFixed(1) + 's',
          topSpeed: `${200 + (index * 12)} km/h`
        });
      });
    });
  });

  return carsList;
};

function App() {
  const globalCars = useMemo(() => generateGlobalCars(), []);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const [currentPage, setCurrentPage] = useState<'home' | 'showroom' | 'details' | 'about'>('home');
  const [selectedCar, setSelectedCar] = useState<Car>(globalCars[0]);

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

  const filteredCars = useMemo(() => {
    return globalCars.filter((car) => {
      const matchesSearch = car.name.toLowerCase().includes(search.toLowerCase()) ||
                            car.type.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || car.type === category;
      return matchesSearch && matchesCategory;
    });
  }, [globalCars, search, category]);

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
                <span className="eyebrow">GLOBAL AUTOMOTIVE DATABASE</span>
                <h1>SEARCH 1,000+<br /><span>WORLDWIDE CARS.</span></h1>
                <p>
                  Explore every car brand across the globe. From Toyota to Bugatti, search and reserve your dream car in seconds.
                </p>
                <div className="hero-buttons">
                  <button className="primary-btn" onClick={() => setCurrentPage('showroom')}>
                    Search Database 🏎️
                  </button>
                  <button className="secondary-btn" onClick={() => setCurrentPage('about')}>
                    Learn More
                  </button>
                </div>
                <div className="hero-stats">
                  <div><strong>500+</strong><small>Vehicles Loaded</small></div>
                  <div><strong>100%</strong><small>Online Booking</small></div>
                  <div><strong>24/7</strong><small>Global Coverage</small></div>
                </div>
              </div>

              <div className="hero-image">
                <img
                  src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80"
                  alt="Global Cars"
                />
                <div className="image-label">GLOBAL SEARCH ENGINE</div>
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
                {['All', 'Sports', 'Luxury', 'SUV', 'Electric', 'Sedan'].map((item) => (
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
                  <span className="eyebrow">GLOBAL DATABASE ENGINE</span>
                  <h2>Search Any Car Model</h2>
                </div>
                <span className="car-count">{filteredCars.length} VEHICLES FOUND</span>
              </div>

              <div className="search-box">
                <span>🌍</span>
                <input
                  type="text"
                  placeholder="Type any brand (e.g. Toyota, BMW, Nissan, Ferrari, Honda)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="car-grid">
                {filteredCars.slice(0, 60).map((car) => (
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

              {filteredCars.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
                  No vehicles found matching "{search}". Try searching for popular brands like "Toyota", "BMW", "Audi", or "Nissan".
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
                <span className="eyebrow">{selectedCar.year} GLOBAL MODEL</span>
                <h1>{selectedCar.name}</h1>
                <p className="description" style={{ color: 'var(--text-muted)', marginTop: '10px' }}>
                  The {selectedCar.name} combines precision performance with world-class engineering. Full international specs available upon reservation.
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
                    Reserve Worldwide 💳
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'about' && (
          <div className="page-fade-in about-page" style={{ padding: '60px', textAlign: 'center' }}>
            <span className="eyebrow">ABOUT KARL ZOLT DATABASE</span>
            <h1>WORLDWIDE AUTOMOTIVE<br /><span>DIRECTORY.</span></h1>
            <p className="about-text" style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '20px auto' }}>
              Karl Zolt gives you access to search, preview, and reserve hundreds of car models across all global categories directly from your mobile device.
            </p>
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
              <h3>Secure Credit Card Payment 🔒</h3>
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
            <p style={{ color: 'var(--text-muted)', margin: '10px 0' }}>Your transaction was processed successfully.</p>
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
              Return to Showroom
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