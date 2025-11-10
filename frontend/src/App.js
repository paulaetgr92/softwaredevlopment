import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import SellerDashboard from "./components/Sellers";
import AtivarConta from "./components/Sellers";
import ProductDetail from "./components/ProductDetail";
import ProductList from "./components/ProductList";
import PublicProducts from "./components/ProdutosPublicos";
import ProductPublicList from "./components/ProductPublicList";


function App() {
    const token = localStorage.getItem("token"); // token do admin ou seller

    return (
        <Router>
            <Routes>
                {/* Painel Admin */}
                <Route path="/admin" element={<AdminDashboard adminToken={token} onLogout={() => window.location.reload()} />} />
                {/* Painel Admin */}

                <Route path="/admin/produto/:id" element={<AdminDashboard adminToken={token} onLogout={() => window.location.reload()} />} />
                {/* Painel Seller */}

                <Route path="/seller" element={<SellerDashboard token={token} />} />

                {/* Ativação de Conta Seller */}
                <Route path="/ativar-conta" element={<AtivarConta token={token} />} />

                {/* Lista de produtos públicos */}
                <Route path="/products/public" element={<PublicProducts />} />

                {/* Detalhes de produto público */}
                <Route path="/products/public/:id" element={<PublicProducts />} />

                {/* Detalhes de produto público */}
                <Route path="/products/sale" element={<CreateSale />} />

                {/* Redirect padrão */}
                <Route path="products/sale/list" element={<ListAllProducts />} />
            </Routes>
        </Router>
    );
}

export default App;
