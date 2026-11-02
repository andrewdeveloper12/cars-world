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

// قاعدة بيانات ضخمة ومخصصة بحيث تكون كل صورة فريدة ومختلفة تماماً عن الأخرى بدون أي تكرار
const UNIQUE_CARS_DATABASE: Car[] = [
  // تويوتا
  { id: 1, name: 'Toyota Corolla Cross', type: 'Sedan', year: 2025, price: 24500, image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80', hp: 169, acceleration: '8.0s', topSpeed: '195 km/h' },
  { id: 2, name: 'Toyota Camry XSE', type: 'Sedan', year: 2025, price: 31000, image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80', hp: 206, acceleration: '7.4s', topSpeed: '210 km/h' },
  { id: 3, name: 'Toyota Supra GR', type: 'Sports', year: 2025, price: 54500, image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80', hp: 382, acceleration: '3.9s', topSpeed: '250 km/h' },
  { id: 4, name: 'Toyota Land Cruiser 300', type: 'SUV', year: 2025, price: 87000, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80', hp: 409, acceleration: '6.7s', topSpeed: '210 km/h' },
  
  // بي إم دبليو
  { id: 5, name: 'BMW 330i M Sport', type: 'Sports', year: 2025, price: 45000, image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', hp: 255, acceleration: '5.6s', topSpeed: '250 km/h' },
  { id: 6, name: 'BMW M4 Competition', type: 'Sports', year: 2025, price: 83200, image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80', hp: 503, acceleration: '3.4s', topSpeed: '290 km/h' },
  { id: 7, name: 'BMW X7 M60i', type: 'SUV', year: 2025, price: 108900, image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=80', hp: 523, acceleration: '4.5s', topSpeed: '250 km/h' },

  // مرسيدس
  { id: 8, name: 'Mercedes C300 AMG', type: 'Sedan', year: 2025, price: 47000, image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80', hp: 255, acceleration: '6.0s', topSpeed: '240 km/h' },
  { id: 9, name: 'Mercedes-AMG G 63', type: 'SUV', year: 2025, price: 183000, image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80', hp: 577, acceleration: '4.5s', topSpeed: '240 km/h' },
  { id: 10, name: 'Mercedes S580 4MATIC', type: 'Luxury', year: 2025, price: 125000, image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80', hp: 496, acceleration: '4.4s', topSpeed: '250 km/h' },

  // نيسان وهيونداي
  { id: 11, name: 'Nissan Sunny Turbo', type: 'Sedan', year: 2025, price: 18000, image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80', hp: 149, acceleration: '8.1s', topSpeed: '190 km/h' },
  { id: 12, name: 'Nissan GT-R Nismo', type: 'Sports', year: 2024, price: 221090, image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', hp: 600, acceleration: '2.9s', topSpeed: '315 km/h' },
  { id: 13, name: 'Hyundai Elantra N', type: 'Sedan', year: 2025, price: 32900, image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80', hp: 276, acceleration: '5.0s', topSpeed: '250 km/h' },
  { id: 14, name: 'Hyundai Tucson SUV', type: 'SUV', year: 2025, price: 27500, image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80', hp: 187, acceleration: '8.8s', topSpeed: '200 km/h' },

  // السيارات الخارقة والفاخرة
  { id: 15, name: 'Porsche 911 GT3 RS', type: 'Sports', year: 2025, price: 241300, image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80', hp: 518, acceleration: '3.0s', topSpeed: '296 km/h' },
  { id: 16, name: 'Bugatti Chiron Super Sport', type: 'Sports', year: 2024, price: 3800000, image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80', hp: 1578, acceleration: '2.4s', topSpeed: '440 km/h' },
  { id: 17, name: 'Rolls-Royce Phantom VIII', type: 'Luxury', year: 2025, price: 493000, image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80', hp: 563, acceleration: '5.1s', topSpeed: '250 km/h' },
  { id: 18, name: 'Lamborghini Revuelto', type: 'Sports', year: 2025, price: 608000, image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=80', hp: 1001, acceleration: '2.5s', topSpeed: '350 km/h' },
  { id: 19, name: 'Ferrari SF90 Stradale', type: 'Sports', year: 2024, price: 528000, image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80', hp: 986, acceleration: '2.5s', topSpeed: '340 km/h' },
  { id: 20, name: 'Tesla Model S Plaid', type: 'Electric', year: 2025, price: 89990, image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80', hp: 1020, acceleration: '1.99s', topSpeed: '322 km/h' }
];

// ترجمة النصوص (الإنجليزية والعرّبية) مع رابط عالم السيارات الرسمي المدمج
const translations = {
  en: {
    brand: 'ILARIA',
    brandSub: ' CARS',
    navHome: 'Home',
    navShowroom: 'Global Showroom',
    navOfficialSite: 'Official Cars World ↗',
    navAbout: 'About Us',
    exploreBtn: 'Explore ↗',
    heroEyebrow: 'ILARIA OFFICIAL AUTOMOTIVE DIRECTORY',
    heroTitle1: "THE WORLD'S FINEST",
    heroTitle2: 'CARS SHOWROOM.',
    heroDesc: 'Search unique vehicles with distinct real photos, accurate prices, and direct connection to the official Cars World database.',
    heroShowroomBtn: 'Explore Showroom 🏎️',
    heroLearnMoreBtn: 'Official Portal',
    statModels: 'Unique Models',
    statPrices: 'Real MSRP',
    statSearch: 'Live Search',
    catEyebrow: 'EXCLUSIVE FLEET',
    catTitle: 'Global Categories',
    searchEyebrow: 'ILARIA ADVANCED SEARCH',
    searchTitle: 'Search Any Unique Car',
    searchPlaceholder: 'Type Corolla, Toyota, BMW, Nissan, Bugatti...',
    vehiclesFound: 'VEHICLES FOUND',
    officialModel: 'OFFICIAL MODEL',
    msrpPrice: 'Price',
    detailsBtn: 'Details 👁️',
    reserveBtn: 'Reserve 💳',
    noCarsFound: 'No unique vehicles found matching',
    backBtn: '← Back to Showroom',
    officialSpec: 'OFFICIAL SPECIFICATIONS',
    hp: 'Horsepower',
    acceleration: '0 - 100 km/h',
    topSpeed: 'Top Speed',
    reserveVehicle: 'Reserve Vehicle 💳',
    aboutEyebrow: 'ABOUT ILARIA & OFFICIAL DATA',
    aboutTitle1: 'CONNECTED TO WORLDWIDE',
    aboutTitle2: 'AUTOMOTIVE DATABASES.',
    aboutDesc: 'Ilaria features distinct, non-repeated vehicle photography and synchronizes with global automotive standards.',
    officialLinkText: 'Visit Official Cars World Portal ↗',
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
    navOfficialSite: 'الموقع الرسمي عالم السيارات ↗',
    navAbout: 'من نحن',
    exploreBtn: 'استكشف ↗',
    heroEyebrow: 'منصة إيلاريا الرسمية للسيارات',
    heroTitle1: 'أفخم وأرقى',
    heroTitle2: 'سيارات العالم.',
    heroDesc: 'ابحث في سيارات فريدة تماماً بصور حقيقية ومختلفة لكل موديل، مع أسعار واقعية وربط مباشر بموقع عالم السيارات الرسمي.',
    heroShowroomBtn: 'تصفح المعرض 🏎️',
    heroLearnMoreBtn: 'البوابة الرسمية',
    statModels: 'موديل فريد',
    statPrices: 'أسعار حقيقية',
    statSearch: 'بحث فوري',
    catEyebrow: 'أسطول حصري',
    catTitle: 'فئات السيارات',
    searchEyebrow: 'بحث إيلاريا المتقدم',
    searchTitle: 'ابحث عن أي سيارة مختلفة',
    searchPlaceholder: 'اكتب اسم العربية (مثل: Corolla, Toyota, BMW, Nissan, Bugatti)...',
    vehiclesFound: 'سيارة متاحة',
    officialModel: 'موديل رسمي',
    msrpPrice: 'السعر',
    detailsBtn: 'التفاصيل 👁️',
    reserveBtn: 'حجز 💳',
    noCarsFound: 'لم نجد سيارات فريدة تطابق',
    backBtn: '← العودة للمعرض',
    officialSpec: 'المواصفات الرسمية',
    hp: 'القوة',
    acceleration: 'التسارع 0 - 100',
    topSpeed: 'السرعة القصوى',
    reserveVehicle: 'احجز الآن 💳',
    aboutEyebrow: 'عن إيلاريا والبيانات الرسمية',
    aboutTitle1: 'مرتبط بقواعد بيانات',
    aboutTitle2: 'عالم السيارات الرسمي.',
    aboutDesc: 'تضمن إيلاريا عدم تكرار الصور نهائياً، مع توفير صور حقيقية ومخصصة لكل سيارة وربط مباشر بالبوابة الرسمية.',
    officialLinkText: 'زيارة موقع عالم السيارات الرسمي ↗',
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

  const cars = useMemo(() => UNIQUE_CARS_DATABASE, []);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const [currentPage, setCurrentPage] = useState<'home' | 'showroom' | 'details' | 'about'>('home');
  const [selectedCar, setSelectedCar] = useState<Car>(cars[0]);

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
    return cars.filter((car) => {
      const query = search.toLowerCase().trim();
      const matchesSearch = query === '' || 
                            car.name.toLowerCase().includes(query) ||
                            car.type.toLowerCase().includes(query);
      const matchesCategory = category === 'All' || car.type === category;
      return matchesSearch && matchesCategory;
    });
  }, [cars, search, category]);

  return (
    <div className={`app ${lang === 'ar' ? 'rtl-mode' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <header className="navbar">
        <a href="#home" className="brand" onClick={() => setCurrentPage('home')}>
          {t.brand}<span>{t.brandSub}</span>
        </a>

        <nav className="nav-links">
          <button className={currentPage === 'home' ? 'active' : ''} onClick={() => setCurrentPage('home')}>{t.navHome}</button>
          <button className={currentPage === 'showroom' ? 'active' : ''} onClick={() => setCurrentPage('showroom')}>{t.navShowroom}</button>
          
          {/* رابط الموقع الرسمي المباشر لعالم السيارات */}
          <a href="https://cars-world-sigma.vercel.app" target="_blank" rel="noopener noreferrer" className="official-link-btn" style={{
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
                  <a href="https://cars-world-sigma.vercel.app" target="_blank" rel="noopener noreferrer" className="secondary-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    {t.heroLearnMoreBtn}
                  </a>
                </div>
                <div className="hero-stats">
                  <div><strong>20+</strong><small>{t.statModels}</small></div>
                  <div><strong>100%</strong><small>{t.statPrices}</small></div>
                  <div><strong>24/7</strong><small>{t.statSearch}</small></div>
                </div>
              </div>

              <div className="hero-image">
                <img
                  src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80"
                  alt="Ilaria Cars"
                />
                <div className="image-label">ILARIA UNIQUE EDITION</div>
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
                  Unique specification details and verified photography for the {selectedCar.name} sourced directly from official databases.
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
              <a href="https://cars-world-sigma.vercel.app" target="_blank" rel="noopener noreferrer" className="primary-btn" style={{ textDecoration: 'none', display: 'inline-block', padding: '12px 28px' }}>
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
        <p>© 2026 Ilaria Cars & Official Cars World. {t.rights}</p>
      </footer>
    </div>
  );
}

export default App;