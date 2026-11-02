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

// داتا شاملة لكل ماركات العالم مع الموديلات الواقعية والصور المخصصة
const BRAND_DATA = [
  {
    brand: 'Toyota',
    type: 'Sedan',
    models: [
      { name: 'Toyota Corolla Cross', price: 24500, img: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80', hp: 169, acc: '8.0s', speed: '195 km/h' },
      { name: 'Toyota Camry XSE', price: 31000, img: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80', hp: 206, acc: '7.4s', speed: '210 km/h' },
      { name: 'Toyota Supra GR', price: 54500, img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80', hp: 382, acc: '3.9s', speed: '250 km/h' },
      { name: 'Toyota Land Cruiser 300', price: 87000, img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80', hp: 409, acc: '6.7s', speed: '210 km/h' },
      { name: 'Toyota RAV4 Hybrid', price: 31500, img: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80', hp: 219, acc: '7.3s', speed: '180 km/h' }
    ]
  },
  {
    brand: 'BMW',
    type: 'Sports',
    models: [
      { name: 'BMW 330i M Sport', price: 45000, img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80', hp: 255, acc: '5.6s', speed: '250 km/h' },
      { name: 'BMW M4 Competition', price: 83200, img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80', hp: 503, acc: '3.4s', speed: '290 km/h' },
      { name: 'BMW M5 CS', price: 142000, img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80', hp: 627, acc: '2.9s', speed: '305 km/h' },
      { name: 'BMW X7 M60i', price: 108900, img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80', hp: 523, acc: '4.5s', speed: '250 km/h' },
      { name: 'BMW i7 xDrive60', price: 124200, img: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80', hp: 536, acc: '4.5s', speed: '240 km/h' }
    ]
  },
  {
    brand: 'Mercedes-Benz',
    type: 'Luxury',
    models: [
      { name: 'Mercedes C300 AMG Line', price: 47000, img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80', hp: 255, acc: '6.0s', speed: '240 km/h' },
      { name: 'Mercedes S580 4MATIC', price: 125000, img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80', hp: 496, acc: '4.4s', speed: '250 km/h' },
      { name: 'Mercedes-AMG G 63', price: 183000, img: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=800&q=80', hp: 577, acc: '4.5s', speed: '240 km/h' },
      { name: 'Mercedes-AMG GT R', price: 165000, img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80', hp: 577, acc: '3.5s', speed: '318 km/h' }
    ]
  },
  {
    brand: 'Hyundai',
    type: 'Sedan',
    models: [
      { name: 'Hyundai Elantra N', price: 32900, img: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=80', hp: 276, acc: '5.0s', speed: '250 km/h' },
      { name: 'Hyundai Sonata N-Line', price: 34950, img: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=80', hp: 290, acc: '5.2s', speed: '240 km/h' },
      { name: 'Hyundai Tucson SUV', price: 27500, img: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80', hp: 187, acc: '8.8s', speed: '200 km/h' },
      { name: 'Hyundai Ioniq 5 EV', price: 41450, img: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80', hp: 320, acc: '4.5s', speed: '185 km/h' }
    ]
  },
  {
    brand: 'Nissan',
    type: 'Sports',
    models: [
      { name: 'Nissan Sunny Turbo', price: 18000, img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80', hp: 149, acc: '8.1s', speed: '190 km/h' },
      { name: 'Nissan GT-R Nismo', price: 221090, img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80', hp: 600, acc: '2.9s', speed: '315 km/h' },
      { name: 'Nissan Z Performance', price: 51000, img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80', hp: 400, acc: '4.3s', speed: '250 km/h' },
      { name: 'Nissan Patrol V8', price: 82000, img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80', hp: 400, acc: '6.6s', speed: '210 km/h' }
    ]
  },
  {
    brand: 'Porsche',
    type: 'Sports',
    models: [
      { name: 'Porsche 911 GT3 RS', price: 241300, img: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80', hp: 518, acc: '3.0s', speed: '296 km/h' },
      { name: 'Porsche Cayenne Turbo GT', price: 196300, img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80', hp: 650, acc: '3.1s', speed: '300 km/h' },
      { name: 'Porsche Taycan Turbo S', price: 194900, img: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80', hp: 750, acc: '2.6s', speed: '260 km/h' },
      { name: 'Porsche Panamera GTS', price: 135200, img: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80', hp: 473, acc: '3.7s', speed: '300 km/h' }
    ]
  },
  {
    brand: 'Lamborghini',
    type: 'Sports',
    models: [
      { name: 'Lamborghini Revuelto', price: 608000, img: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80', hp: 1001, acc: '2.5s', speed: '350 km/h' },
      { name: 'Lamborghini Urus Performante', price: 269885, img: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80', hp: 657, acc: '3.3s', speed: '306 km/h' },
      { name: 'Lamborghini Huracán Sterrato', price: 278972, img: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80', hp: 602, acc: '3.4s', speed: '260 km/h' }
    ]
  },
  {
    brand: 'Ferrari',
    type: 'Sports',
    models: [
      { name: 'Ferrari SF90 Stradale', price: 528000, img: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80', hp: 986, acc: '2.5s', speed: '340 km/h' },
      { name: 'Ferrari Purosangue V12', price: 398350, img: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80', hp: 715, acc: '3.3s', speed: '310 km/h' },
      { name: 'Ferrari 296 GTB', price: 322986, img: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80', hp: 818, acc: '2.9s', speed: '330 km/h' }
    ]
  },
  {
    brand: 'Bugatti',
    type: 'Sports',
    models: [
      { name: 'Bugatti Chiron Super Sport', price: 3800000, img: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80', hp: 1578, acc: '2.4s', speed: '440 km/h' },
      { name: 'Bugatti Mistral Roadster', price: 5000000, img: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80', hp: 1578, acc: '2.3s', speed: '420 km/h' }
    ]
  },
  {
    brand: 'Rolls-Royce',
    type: 'Luxury',
    models: [
      { name: 'Rolls-Royce Phantom VIII', price: 493000, img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80', hp: 563, acc: '5.1s', speed: '250 km/h' },
      { name: 'Rolls-Royce Cullinan SUV', price: 391000, img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80', hp: 563, acc: '4.8s', speed: '250 km/h' },
      { name: 'Rolls-Royce Spectre EV', price: 422750, img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80', hp: 577, acc: '4.4s', speed: '250 km/h' }
    ]
  }
];

const generateAllCars = (): Car[] => {
  const cars: Car[] = [];
  let id = 1;

  BRAND_DATA.forEach((b) => {
    b.models.forEach((m) => {
      cars.push({
        id: id++,
        name: m.name,
        type: b.type,
        year: 2025,
        price: m.price,
        image: m.img,
        hp: parseInt(m.hp.toString()),
        acceleration: m.acc,
        topSpeed: m.speed
      });
    });
  });

  return cars;
};

function App() {
  const allCars = useMemo(() => generateAllCars(), []);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const [currentPage, setCurrentPage] = useState<'home' | 'showroom' | 'details' | 'about'>('home');
  const [selectedCar, setSelectedCar] = useState<Car>(allCars[0]);

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
    setOrderId('ILARIA-' + Math.floor(100000 + Math.random() * 900000));
    setCart([]);
  };

  const openCarDetails = (car: Car) => {
    setSelectedCar(car);
    setCurrentPage('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredCars = useMemo(() => {
    return allCars.filter((car) => {
      const query = search.toLowerCase().trim();
      const matchesSearch = query === '' || 
                            car.name.toLowerCase().includes(query) ||
                            car.type.toLowerCase().includes(query);
      const matchesCategory = category === 'All' || car.type === category;
      return matchesSearch && matchesCategory;
    });
  }, [allCars, search, category]);

  return (
    <div className="app">
      <header className="navbar">
        <a href="#home" className="brand" onClick={() => setCurrentPage('home')}>
          ILARIA<span> CARS</span>
        </a>

        <nav className="nav-links">
          <button className={currentPage === 'home' ? 'active' : ''} onClick={() => setCurrentPage('home')}>الرئيسية</button>
          <button className={currentPage === 'showroom' ? 'active' : ''} onClick={() => setCurrentPage('showroom')}>معرض السيارات</button>
          <button className={currentPage === 'about' ? 'active' : ''} onClick={() => setCurrentPage('about')}>من نحن</button>
        </nav>

        <div className="header-actions">
          <button className="cart-badge-btn" onClick={() => setIsCartOpen(true)}>
            🛒 <span className="cart-count">{cart.reduce((a, b) => a + b.quantity, 0)}</span>
          </button>
          <button className="nav-button" onClick={() => setCurrentPage('showroom')}>
            استكشف ↗
          </button>
        </div>
      </header>

      <main className="main-content">
        {currentPage === 'home' && (
          <div className="page-fade-in">
            <section className="hero">
              <div className="hero-content">
                <span className="eyebrow">إيلاريا لعالم السيارات</span>
                <h1>أفخم وأرقى<br /><span>سيارات العالم.</span></h1>
                <p>
                  ابحث واحجز أفضل السيارات عالمياً من إيلاريا: من تويوتا ونيسان إلى بورش وبوجاتي ورولز رويس.
                </p>
                <div className="hero-buttons">
                  <button className="primary-btn" onClick={() => setCurrentPage('showroom')}>
                    تصفح المعرض 🏎️
                  </button>
                  <button className="secondary-btn" onClick={() => setCurrentPage('about')}>
                    اعرف المزيد
                  </button>
                </div>
                <div className="hero-stats">
                  <div><strong>100+</strong><small>سيارة متاحة</small></div>
                  <div><strong>100%</strong><small>أسعار حقيقية</small></div>
                  <div><strong>24/7</strong><small>حجز أونلاين</small></div>
                </div>
              </div>

              <div className="hero-image">
                <img
                  src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80"
                  alt="Ilaria Cars"
                />
                <div className="image-label">ILARIA EDITION</div>
              </div>
            </section>
          </div>
        )}

        {currentPage === 'showroom' && (
          <div className="page-fade-in">
            <section className="categories">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">معرض إيلاريا الشامل</span>
                  <h2>فئات السيارات</h2>
                </div>
              </div>

              <div className="category-list">
                {['All', 'Sports', 'Luxury', 'SUV', 'Sedan'].map((item) => (
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
                  <span className="eyebrow">محرك بحث إيلاريا</span>
                  <h2>ابحث عن أي سيارة</h2>
                </div>
                <span className="car-count">{filteredCars.length} سيارة متاحة</span>
              </div>

              <div className="search-box">
                <span>🔍</span>
                <input
                  type="text"
                  placeholder="اكتب اسم العربية (مثل: Corolla, Toyota, BMW, Nissan, Ferrari)..."
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
                      <div className="car-year">{car.year} موديل</div>
                      <h3 onClick={() => openCarDetails(car)}>{car.name}</h3>
                      
                      <div className="car-bottom">
                        <div className="car-bottom-row">
                          <small style={{ color: 'var(--text-muted)' }}>السعر</small>
                          <strong>${car.price.toLocaleString()}</strong>
                        </div>
                        <div className="card-btn-group">
                          <button className="details-btn" onClick={() => openCarDetails(car)}>
                            التفاصيل 👁️
                          </button>
                          <button className="buy-btn" onClick={() => addToCart(car)}>
                            حجز 💳
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {filteredCars.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
                  لم نجد سيارات تطابق "{search}". جرب البحث عن "Toyota" أو "Corolla" أو "BMW".
                </p>
              )}
            </section>
          </div>
        )}

        {currentPage === 'details' && selectedCar && (
          <div className="page-fade-in details-page">
            <button className="back-btn" onClick={() => setCurrentPage('showroom')}>
              ← العودة للمعرض
            </button>

            <div className="details-container">
              <div className="details-image-box">
                <img src={selectedCar.image} alt={selectedCar.name} />
              </div>

              <div className="details-info-box">
                <span className="eyebrow">{selectedCar.year} المواصفات الرسمية</span>
                <h1>{selectedCar.name}</h1>
                <p className="description" style={{ color: 'var(--text-muted)', marginTop: '10px' }}>
                  تفاصيل ومواصفات {selectedCar.name} مقدمة من إيلاريا لعالم السيارات.
                </p>

                <div className="specs-grid">
                  <div className="spec-card">
                    <small>القوة</small>
                    <strong>{selectedCar.hp} حصان</strong>
                  </div>
                  <div className="spec-card">
                    <small>التسارع 0 - 100</small>
                    <strong>{selectedCar.acceleration}</strong>
                  </div>
                  <div className="spec-card">
                    <small>السرعة القصوى</small>
                    <strong>{selectedCar.topSpeed}</strong>
                  </div>
                </div>

                <div className="details-price-row">
                  <div>
                    <small style={{ color: 'var(--text-muted)' }}>سعر الحجز</small>
                    <h2 style={{ fontSize: '1.8rem', color: '#fff' }}>${selectedCar.price.toLocaleString()}</h2>
                  </div>
                  <button className="checkout-btn" style={{ width: 'auto', padding: '12px 24px' }} onClick={() => addToCart(selectedCar)}>
                    احجز الآن 💳
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'about' && (
          <div className="page-fade-in about-page" style={{ padding: '60px', textAlign: 'center' }}>
            <span className="eyebrow">عن موقع إيلاريا</span>
            <h1>موقع إيلاريا<br /><span>لعالم السيارات العالمية.</span></h1>
            <p className="about-text" style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '20px auto' }}>
              منصة إيلاريا تتيح لك البحث عن أحدث وأرقى السيارات عالمياً مع إمكانية المعاينة والحجز أونلاين فوراً.
            </p>
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="modal-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>سلة حجز إيلاريا 🛒</h3>
              <button onClick={() => setIsCartOpen(false)}>✕</button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart" style={{ padding: '20px 0', color: 'var(--text-muted)' }}><p>السلة فارغة حالياً.</p></div>
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
                    <span>الإجمالي:</span>
                    <strong>${totalPrice.toLocaleString()}</strong>
                  </div>
                  <button 
                    className="checkout-btn"
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                  >
                    متابعة الدفع بالبطاقة 💳
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
              <h3>الدفع الإلكتروني الآمن - إيلاريا 🔒</h3>
              <button onClick={() => setIsCheckoutOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleCheckout} className="checkout-form">
              <div className="card-preview">
                <div className="card-type" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>VISA / MASTERCARD</div>
                <div className="card-number-display">
                  {cardData.cardNumber || '•••• •••• •••• ••••'}
                </div>
                <div className="card-footer-display">
                  <span>{cardData.name || 'اسم صاحب البطاقة'}</span>
                  <span>{cardData.expDate || 'MM/YY'}</span>
                </div>
              </div>

              <div className="form-group">
                <label>اسم صاحب البطاقة</label>
                <input
                  type="text"
                  required
                  placeholder="Andrew Zolt"
                  value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>رقم البطاقة</label>
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
                  <label>تاريخ الانتهاء</label>
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
                  <label>رمز الأمان (CVC)</label>
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
                <span>المبلغ الإجمالي:</span>
                <strong>${totalPrice.toLocaleString()}</strong>
              </div>

              <button type="submit" className="pay-now-btn">
                تأكيد وإتمام الحجز 🚀
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
            <h2>تم تأكيد حجزك في إيلاريا!</h2>
            <p style={{ color: 'var(--text-muted)', margin: '10px 0' }}>تمت عملية الدفع الوهمية بنجاح بنسبة 100%.</p>
            <div className="order-id">
              رقم المرجعية: <strong>{orderId}</strong>
            </div>
            <button 
              className="primary-btn"
              onClick={() => {
                setOrderSuccess(false);
                setCurrentPage('showroom');
              }}
            >
              العودة للمعرض
            </button>
          </div>
        </div>
      )}

      <footer>
        <a href="#home" className="brand">ILARIA<span> CARS</span></a>
        <p>© 2026 Ilaria Cars World. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}

export default App;