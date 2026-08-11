import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProductList from './pages/ProductList';
import SupplierList from './pages/SupplierList';
import Login from './pages/Login';
import './App.css';
import SupplierForm from './pages/SupplierForm';
import ProductForm from './pages/ProductForm';
import Layout from './components/Layout';
import ProductView from './pages/ProductView';
import ChangePassword from './pages/ChangePassword';

function App() {
  return (
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/products" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/new" element={<ProductForm />} />
        <Route path="/products/:id/edit" element={<ProductForm />} />
        <Route path="/products/:id" element={<ProductView />} />
        <Route path="/suppliers" element={<SupplierList />} />
        <Route path="/suppliers/new" element={<SupplierForm />} />
        <Route path="/suppliers/:id/edit" element={<SupplierForm />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Routes>
    </Layout>
  </BrowserRouter>
);
}

export default App;