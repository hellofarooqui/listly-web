import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GroceryProvider } from './context/GroceryContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Cart from './pages/Cart';
import AddItem from './pages/AddItem';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <GroceryProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/add-item" element={<AddItem />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </GroceryProvider>
    </Router>
  );
}

export default App;