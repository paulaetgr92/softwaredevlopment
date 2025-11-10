import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// COMPONENTES
import AdminDashboard from "./components/AdminDashboard";
import AtivarConta from "./components/Sellers";// corrigido
import ProductDetail from "./components/ProductDetail";
import ProductList from "./components/ProductList";
import PublicProducts from "./components/ProdutosPublicos";
import CreateSale from "./components/SalesForm";
import ListAllProducts from "./components/ProductList"; // se for lista de vendas, talvez precise criar um componente separado

function App() {
    const token = localStorage.getItem("token"); // token do admin ou seller

    return (
        <Router>
            <Routes>
                {/* Painel Admin */}
                <Route
                    path="/admin"
                    element={<AdminDashboard adminToken={token} onLogout={() => window.location.reload()} />}
                />

                {/* Lista de produtos do admin */}
                <Route path="/admin/produtos/list" element={<ProductList />} />

                {/* Detalhes de produto do admin */}
                <Route path="/admin/products/:id" element={<ProductDetail />} />

                {/* Painel Seller */}
                <Route path="/seller" element={<SellerDashboard token={token} />} />

                {/* Ativação de Conta Seller */}
                <Route path="/ativar-conta" element={<AtivarConta token={token} />} />

                {/* Lista de produtos públicos */}
                <Route path="/products/public" element={<PublicProducts />} />

                {/* Detalhes de produto público */}
                <Route path="/products/public/:id" element={<ProductDetail />} />

                {/* Criar venda */}
                <Route path="/products/sale" element={<CreateSale />} />

                {/* Lista de vendas */}
                <Route path="/products/sale/list" element={<ListAllProducts />} />

                {/* Redirect padrão */}
                <Route path="*" element={<Navigate to="/seller" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
