import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from 'react-router-dom';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import StoreList from './pages/StoreList';
import StoreDetail from './pages/StoreDetail';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="app-nav">
      <Link 
        to="/products" 
        className={location.pathname.startsWith('/products') ? 'active' : ''}
      >
        Products
      </Link>
      <Link 
        to="/stores" 
        className={location.pathname.startsWith('/stores') ? 'active' : ''}
      >
        Stores
      </Link>
    </nav>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="app">
          <header className="app-header">
            <h1>Inventory Management</h1>
            <Navigation />
          </header>
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Navigate to="/products" replace />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/new" element={<ProductDetail />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/stores" element={<StoreList />} />
              <Route path="/stores/new" element={<StoreDetail />} />
              <Route path="/stores/:id" element={<StoreDetail />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
