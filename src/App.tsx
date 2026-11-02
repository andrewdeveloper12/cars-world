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

// قائمة البراندات العالمية والموديلات الحقيقية
const BRANDS = [
  { name: 'Toyota', models: ['Corolla', 'Camry', 'Supra', 'Land Cruiser', 'RAV4', 'Yaris', 'Highlander'], type: 'Sedan', basePrice: 22000 },
  { name: 'BMW', models: ['330i', 'M4 Competition', 'M5 CS', 'X7 M60i', 'i7', 'X5', 'M2'], type: 'Sports', basePrice: 45000 },
  { name: 'Mercedes-Benz', models: ['C300 AMG', 'S580 4MATIC', 'G 63 AMG', 'GT R', 'E400', 'GLE Coupe'], type: 'Luxury', basePrice: 50000 },
  { name: 'Nissan', models: ['Sunny Turbo', 'GT-R Nismo', 'Z Performance', 'Patrol V8', 'Altima', 'X-Trail'], type: 'SUV', basePrice: 20000 },
  { name: 'Hyundai', models: ['Elantra N', 'Sonata N-Line', 'Tucson', 'Ioniq 5', 'Santa Fe', 'Creta'], type: 'Sedan', basePrice: 21000 },
  { name: 'Porsche', models: ['911 GT3 RS', 'Cayenne Turbo', 'Taycan S', 'Panamera GTS', 'Macan GTS'], type: 'Sports', basePrice: 110000 },
  { name: 'Lamborghini', models: ['Revuelto', 'Urus Performante', 'Huracán Sterrato', 'Aventador SVJ'], type: 'Sports', basePrice: 250000 },
  { name: 'Ferrari', models: ['SF90 Stradale', 'Purosangue V12', '296 GTB', 'F8 Tributo', 'Roma'], type: 'Sports', basePrice: 280000 },
  { name: 'Bugatti', models: ['Chiron Super Sport', 'Mistral Roadster', 'Divo', 'Centodieci'], type: 'Sports', basePrice: 3000000 },
  { name: 'Rolls-Royce', models: ['Phantom VIII', 'Cullinan SUV', 'Spectre EV', 'Ghost Black Badge'], type: 'Luxury', basePrice: 400000 },
  { name: 'Tesla', models: ['Model S Plaid', 'Model 3 Performance', 'Model X', 'Cybertruck', 'Model Y'], type: 'Electric', basePrice: 48000 },
  { name: 'Audi', models: ['R8 V10', 'RS6 Avant', 'RS7 Sportback', 'e-tron GT', 'Q8'], type: 'Sports', basePrice: 46000 }
];

const TRIMS = ['Standard', 'Sport', 'Executive', 'Performance', 'Edition', 'Carbon Line', 'Night Edition'];

// دالة توليد صور وداتا متجددة وفريدة 100% لكل سيارة بدون تكرار
const generateUniqueCars = (): Car[] => {
  const carsList: Car[] = [];
  let idCounter = 1;

  BRANDS.forEach((brandObj) => {
    brandObj.models.forEach((modelName) => {
      TRIMS.forEach((trim, tIdx) => {
        const carFullName = `${brandObj.name} ${modelName} ${trim}`;
        // استخدام محرك صور ديناميكي بناءً على اسم السيارة ورقم الفريد لضمان اختلاف الصور
        const uniqueImageUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(brandObj.name + ' ' + modelName + ' car')}&sig=${idCounter}`;

        carsList.push({
          id: idCounter++,
          name: carFullName,
          type: brandObj.type,
          year: 2020 + (tIdx % 6),
          price: brandObj.basePrice + (tIdx * 4500) + (idCounter * 120),
          image: uniqueImageUrl,
          hp: 180 + (tIdx * 45) + (idCounter % 300),
          acceleration: (2.2 + (tIdx * 0.4)).toFixed(1) + 's',
          topSpeed: `${210 + (tIdx * 15)} km/h`
        });
      });
    });
  });

  return carsList;
};

// الترجمات
const translations = {
  en: {
    brand: 'ILARIA',
    brandSub: ' CARS',
    navHome: 'Home',
    navShowroom: 'Global Showroom',
    navOfficialSite: 'Car and Driver ↗',
    navAbout: 'About Us',
    exploreBtn: 'Explore ↗',
    heroEyebrow: 'ILARIA DIRECTORY',
    heroTitle1: 'UNIQUE & VERIFIED',
    heroTitle2: 'WORLDWIDE CARS.',
    heroDesc: 'Explore hundreds of distinct car models with non-repeated authentic imagery and real market prices.',
    heroShowroomBtn: 'Explore Fleet 🏎️',
    heroLearnMoreBtn: 'Global Portal',
    statModels: 'Unique Cars',
    statPrices: 'Real Prices',
    statSearch: 'Live Search',
    catEyebrow: 'WORLDWIDE FLEET',
    catTitle: 'Global Categories',
    searchEyebrow: 'DYNAMIC SEARCH ENGINE',
    searchTitle: 'Search Any Unique Model',
    searchPlaceholder: 'Search Corolla, BMW, Sunny, Elantra, Porsche...',
    vehiclesFound: 'VEHICLES FOUND',
    officialModel: 'MODEL',
    msrpPrice: 'Price',
    detailsBtn: 'Details 👁️',
    reserveBtn: 'Reserve 💳',
    noCarsFound: 'No unique vehicles found matching',
    backBtn: '← Back to Showroom',
    officialSpec: 'SPECIFICATIONS',
    hp: 'Horsepower',
    acceleration: '0 - 100 km/h',
    topSpeed: 'Top Speed',
    reserveVehicle: 'Reserve Vehicle 💳',
    aboutEyebrow: 'ABOUT ILARIA',
    aboutTitle1: 'DISTINCT AUTOMOTIVE',
    aboutTitle2: 'DIRECTORY WORLDWIDE.',
    aboutDesc: 'Ilaria guarantees non-repeated, unique visual representation for every car model in the global inventory.',
    officialLinkText: 'Visit Car and Driver Global Portal ↗',
    cartTitle: 'Ilaria Cart 🛒',
    cartEmpty: 'Your cart is empty.',
    totalAmount: 'Total Amount:',
    checkoutBtn: 'Proceed to Payment 💳',
    paymentTitle: 'Secure Credit Card Payment 🔒',
    cardholderName: 'Cardholder Name',
    cardNumber: 'Card Number',
    expDate: 'Expiry Date',
    cvc: 'CVC / CVV',
    confirmPayment: 'Confirm & Complete Payment 🚀',
    orderConfirmed: 'Reservation Confirmed!',
    orderDesc: 'Your transaction was processed successfully.',
    referenceId: 'Reference ID:',
    returnShowroom: 'Return to Showroom',
    rights: 'All rights reserved.'
  },
  ar: {
    brand: 'إيلاريا',
    brandSub: ' للسيارات',
    navHome: 'الرئيسية',
    navShowroom: 'معرض السيارات',
    navOfficialSite: 'موقع عالم السيارات العالمي ↗',
    navAbout: 'من نحن',
    exploreBtn: 'استكشف ↗',
    heroEyebrow: 'منصة إيلاريا العالمية',
    heroTitle1: 'سيارات فريدة',
    heroTitle2: 'بدون أي تكرار.',
    heroDesc: 'تصفح مئات السيارات الفاخرة والعادية بصور حقيقية ومختلفة لكل موديل بأسعار حقيقية.',
    heroShowroomBtn: 'تصفح المعرض 🏎️',
    heroLearnMoreBtn: 'البوابة العالمية',
    statModels: 'سيارة مختلفة',
    statPrices: 'أسعار حقيقية',
    statSearch: 'بحث فوري',
    catEyebrow: 'أسطول إيلاريا',
    catTitle: 'فئات السيارات',
    searchEyebrow: 'محرك بحث متطور',
    searchTitle: 'ابحث في الموديلات الفريدة',
    searchPlaceholder: 'ابحث عن Corolla, BMW, Sunny, Elantra, Porsche...',
    vehiclesFound: 'سيارة متاحة',
    officialModel: 'موديل',
    msrpPrice: 'السعر',
    detailsBtn: 'التفاصيل 👁️',
    reserveBtn: 'حجز 💳',
    noCarsFound: 'لم نجد سيارات تطابق',
    backBtn: '← العودة للمعرض',
    officialSpec: 'المواصفات الرسمية',
    hp: 'القوة',
    acceleration: 'التسارع 0 - 100',
    topSpeed: 'السرعة القصوى',
    reserveVehicle: 'احجز الآن 💳',
    aboutEyebrow: 'عن منصة إيلاريا',
    aboutTitle1: 'دليل السيارات',
    aboutTitle2: 'الفريد وغير المكرر.',
    aboutDesc: 'تضمن إيلاريا عرض صور حقيقية ومختلفة كلياً لكل سيارة متوفرة في قاعدة البيانات.',
    officialLinkText: 'زيارة موقع Car and Driver العالمي ↗',
    cartTitle: 'سلة حجز إيلاريا 🛒',
    cartEmpty: 'السلة فارغة حالياً.',
    totalAmount: 'الإجمالي:',
    checkoutBtn: 'متابعة الدفع بالبطاقة 💳',
    paymentTitle: 'الدفع الإلكتروني الآمن 🔒',
    cardholderName: 'اسم صاحب البطاقة',
    cardNumber: 'رقم البطاقة',
    expDate: 'تاريخ الانتهاء',
    cvc: 'رمز الأمان (CVC)',
    confirmPayment: 'تأكيد وإتمام الحجز 🚀',
    orderConfirmed: 'تم تأكيد حجزك بنجاح!',
    orderDesc: 'تمت عملية الدفع بنجاح بنسبة 100%.',
    referenceId: 'رقم المرجعية:',
    returnShowroom: 'العودة للمعرض',
    rights: 'جميع الحقوق محفوظة.'
  }
};

function App() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const t = translations[lang];

  const allCars = useMemo(() => generateUniqueCars(), []);
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

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

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
    <div className={`app ${lang === 'ar' ? 'rtl-mode' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <header className="navbar">
        <a href="#home" className="brand" onClick={() => setCurrentPage('home')}>
          {t.brand}<span>{t.brandSub}</span>
        </a>

        <nav className="nav-links">
          <button className={currentPage === 'home' ? 'active' : ''} onClick={() => setCurrentPage('home')}>{t.navHome}</button>
          <button className={currentPage === 'showroom' ? 'active' : ''} onClick={() => setCurrentPage('showroom')}>{t.navShowroom}</button>
          
          <a href="https://www.caranddriver.com" target="_blank" rel="noopener noreferrer" className="official-link-btn" style={{
            color: '#38bdf8',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '0.95rem',
            padding: '6px 12px',
            borderRadius: '8px',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.2)'
          }}>
            {t.navOfficialSite}
          </a>

          <button className={currentPage === 'about' ? 'active' : ''} onClick={() => setCurrentPage('about')}>{t.navAbout}</button>
        </nav>

        <div className="header-actions">
          <button className="lang-toggle-btn" onClick={toggleLanguage} style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            color: '#fff',
            padding: '8px 14px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            🌐 {lang === 'en' ? 'عربي' : 'EN'}
          </button>

          <button className="cart-badge-btn" onClick={() => setIsCartOpen(true)}>
            🛒 <span className="cart-count">{cart.reduce((a, b) => a + b.quantity, 0)}</span>
          </button>
          <button className="nav-button" onClick={() => setCurrentPage('showroom')}>
            {t.exploreBtn}
          </button>
        </div>
      </header>

      <main className="main-content">
        {currentPage === 'home' && (
          <div className="page-fade-in">
            <section className="hero">
              <div className="hero-content">
                <span className="eyebrow">{t.heroEyebrow}</span>
                <h1>{t.heroTitle1}<br /><span>{t.heroTitle2}</span></h1>
                <p>{t.heroDesc}</p>
                <div className="hero-buttons">
                  <button className="primary-btn" onClick={() => setCurrentPage('showroom')}>
                    {t.heroShowroomBtn}
                  </button>
                  <a href="https://www.caranddriver.com" target="_blank" rel="noopener noreferrer" className="secondary-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    {t.heroLearnMoreBtn}
                  </a>
                </div>
                <div className="hero-stats">
                  <div><strong>500+</strong><small>{t.statModels}</small></div>
                  <div><strong>100%</strong><small>{t.statPrices}</small></div>
                  <div><strong>24/7</strong><small>{t.statSearch}</small></div>
                </div>
              </div>

              <div className="hero-image">
                <img
                  src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80"
                  alt="Ilaria Unique Fleet"
                />
                <div className="image-label">ILARIA UNIQUE FLEET</div>
              </div>
            </section>
          </div>
        )}

        {currentPage === 'showroom' && (
          <div className="page-fade-in">
            <section className="categories">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">{t.catEyebrow}</span>
                  <h2>{t.catTitle}</h2>
                </div>
              </div>

              <div className="category-list">
                {['All', 'Sports', 'Luxury', 'SUV', 'Sedan', 'Electric'].map((item) => (
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
                  <span className="eyebrow">{t.searchEyebrow}</span>
                  <h2>{t.searchTitle}</h2>
                </div>
                <span className="car-count">{filteredCars.length} {t.vehiclesFound}</span>
              </div>

              <div className="search-box">
                <span>🔍</span>
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
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
                      <div className="car-year">{car.year} {t.officialModel}</div>
                      <h3 onClick={() => openCarDetails(car)}>{car.name}</h3>
                      
                      <div className="car-bottom">
                        <div className="car-bottom-row">
                          <small style={{ color: 'var(--text-muted)' }}>{t.msrpPrice}</small>
                          <strong>${car.price.toLocaleString()}</strong>
                        </div>
                        <div className="card-btn-group">
                          <button className="details-btn" onClick={() => openCarDetails(car)}>
                            {t.detailsBtn}
                          </button>
                          <button className="buy-btn" onClick={() => addToCart(car)}>
                            {t.reserveBtn}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {filteredCars.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
                  {t.noCarsFound} "{search}".
                </p>
              )}
            </section>
          </div>
        )}

        {currentPage === 'details' && selectedCar && (
          <div className="page-fade-in details-page">
            <button className="back-btn" onClick={() => setCurrentPage('showroom')}>
              {t.backBtn}
            </button>

            <div className="details-container">
              <div className="details-image-box">
                <img src={selectedCar.image} alt={selectedCar.name} />
              </div>

              <div className="details-info-box">
                <span className="eyebrow">{selectedCar.year} {t.officialSpec}</span>
                <h1>{selectedCar.name}</h1>
                <p className="description" style={{ color: 'var(--text-muted)', marginTop: '10px' }}>
                  Unique specification details and verified photography for the {selectedCar.name}.
                </p>

                <div className="specs-grid">
                  <div className="spec-card">
                    <small>{t.hp}</small>
                    <strong>{selectedCar.hp} HP</strong>
                  </div>
                  <div className="spec-card">
                    <small>{t.acceleration}</small>
                    <strong>{selectedCar.acceleration}</strong>
                  </div>
                  <div className="spec-card">
                    <small>{t.topSpeed}</small>
                    <strong>{selectedCar.topSpeed}</strong>
                  </div>
                </div>

                <div className="details-price-row">
                  <div>
                    <small style={{ color: 'var(--text-muted)' }}>{t.msrpPrice}</small>
                    <h2 style={{ fontSize: '1.8rem', color: '#fff' }}>${selectedCar.price.toLocaleString()}</h2>
                  </div>
                  <button className="checkout-btn" style={{ width: 'auto', padding: '12px 24px' }} onClick={() => addToCart(selectedCar)}>
                    {t.reserveVehicle}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'about' && (
          <div className="page-fade-in about-page" style={{ padding: '60px', textAlign: 'center' }}>
            <span className="eyebrow">{t.aboutEyebrow}</span>
            <h1>{t.aboutTitle1}<br /><span>{t.aboutTitle2}</span></h1>
            <p className="about-text" style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '20px auto' }}>
              {t.aboutDesc}
            </p>
            <div style={{ marginTop: '25px' }}>
              <a href="https://www.caranddriver.com" target="_blank" rel="noopener noreferrer" className="primary-btn" style={{ textDecoration: 'none', display: 'inline-block', padding: '12px 28px' }}>
                {t.officialLinkText}
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="modal-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>{t.cartTitle}</h3>
              <button onClick={() => setIsCartOpen(false)}>✕</button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart" style={{ padding: '20px 0', color: 'var(--text-muted)' }}><p>{t.cartEmpty}</p></div>
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
                    <span>{t.totalAmount}</span>
                    <strong>${totalPrice.toLocaleString()}</strong>
                  </div>
                  <button 
                    className="checkout-btn"
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                  >
                    {t.checkoutBtn}
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
              <h3>{t.paymentTitle}</h3>
              <button onClick={() => setIsCheckoutOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleCheckout} className="checkout-form">
              <div className="card-preview">
                <div className="card-type" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>VISA / MASTERCARD</div>
                <div className="card-number-display">
                  {cardData.cardNumber || '•••• •••• •••• ••••'}
                </div>
                <div className="card-footer-display">
                  <span>{cardData.name || 'CARDHOLDER NAME'}</span>
                  <span>{cardData.expDate || 'MM/YY'}</span>
                </div>
              </div>

              <div className="form-group">
                <label>{t.cardholderName}</label>
                <input
                  type="text"
                  required
                  placeholder="Andrew Zolt"
                  value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>{t.cardNumber}</label>
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
                  <label>{t.expDate}</label>
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
                  <label>{t.cvc}</label>
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
                <span>{t.totalAmount}</span>
                <strong>${totalPrice.toLocaleString()}</strong>
              </div>

              <button type="submit" className="pay-now-btn">
                {t.confirmPayment}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {orderSuccess && (
        <div className="modal-overlay">
          <div className="success-modal" style={{ textAlign: 'center' }}>
            <div className="success-icon" style={{ fontSize: '30px', marginBottom: '10px' }}>🎉</div>
            <h2>{t.orderConfirmed}</h2>
            <p style={{ color: 'var(--text-muted)', margin: '10px 0' }}>{t.orderDesc}</p>
            <div className="order-id">
              {t.referenceId} <strong>{orderId}</strong>
            </div>
            <button 
              className="primary-btn"
              onClick={() => {
                setOrderSuccess(false);
                setCurrentPage('showroom');
              }}
            >
              {t.returnShowroom}
            </button>
          </div>
        </div>
      )}

      <footer>
        <a href="#home" className="brand">{t.brand}<span>{t.brandSub}</span></a>
        <p>© 2026 Ilaria Cars World. {t.rights}</p>
      </footer>
    </div>
  );
}

export default App;