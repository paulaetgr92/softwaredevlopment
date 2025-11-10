import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createSale, apiFetch } from "../api";
import "./RentalDashboard.css";

export default function RentalDashboard({ token, onLogout }) {
    const [activeTab, setActiveTab] = useState("catalog");
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [rentals, setRentals] = useState([]);
    const [toast, setToast] = useState({ message: "", type: "success" });

    const userEmail = useMemo(() => localStorage.getItem("userEmail") || "Usuário", []);
    const navigate = useNavigate();

    // Carrega produtos do backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await apiFetch("produtos", { method: "GET" }, token);
                const mappedProducts = (data || []).map((p) => ({
                    id: p.id_roupa ?? 0,
                    name: p.categoria ?? "Produto sem nome",
                    tempoValor: p.tempo_valor ?? 0,
                    tamanho: p.tamanho ?? "-",
                    cores: p.cores ?? "-",
                    image_url: p.image_url || "https://via.placeholder.com/300x400",
                }));
                setProducts(mappedProducts);
            } catch (err) {
                console.error("Erro ao buscar produtos:", err);
                showToast("❌ Falha ao carregar produtos", "error");
            }
        };
        fetchProducts();
    }, [token]);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: "", type: "success" }), 3000);
    };

    const addToCart = (product) => {
        if (cart.find((p) => p.id === product.id)) {
            showToast("⚠️ Já está no carrinho!", "warning");
            return;
        }
        setCart([...cart, product]);
        showToast(`✨ ${product.name} adicionado ao carrinho!`);
    };

    const removeFromCart = (id) => {
        setCart(cart.filter((p) => p.id !== id));
        showToast("❌ Item removido do carrinho.");
    };

    const goToRentPage = (productId) => {
        navigate(`/alugar/${productId}`);
    };

    const goToAdmin = () => {
        navigate("/admin");
    };

    const confirmRental = async () => {
        if (!cart.length) {
            showToast("⚠️ Carrinho vazio!", "warning");
            return;
        }

        try {
            const results = [];
            for (const item of cart) {
                const saleData = {
                    produtoId: item.id,
                    quantidade: 1,
                    tempoValor: item.tempoValor
                };

                const res = await createSale(saleData, token);

                results.push({
                    ...item,
                    backendId: res?.produtoId || null,
                    total: res?.total || item.tempoValor
                });
            }

            setRentals((prev) => [...prev, ...results]);
            setCart([]);
            setActiveTab("rentals");
            showToast("🎉 Aluguel confirmado!");

            const firstItemId = results[0]?.id;
            if (firstItemId) navigate(`/alugar/${firstItemId}`);

        } catch (err) {
            console.error("Erro ao enviar aluguel:", err);
            showToast("❌ Falha ao enviar aluguel!", "error");
        }
    };

    return (
        <div className="rental-dashboard">
            <header>
                <h1>DoutorRent</h1>
                <span>Bem-vindo, {userEmail}</span>
                <button onClick={goToAdmin}>Área do Administrador</button>
                <button onClick={onLogout}>Sair</button>
            </header>

            <nav>
                <button onClick={() => setActiveTab("catalog")}>👗 Catálogo</button>
                <button onClick={() => setActiveTab("cart")}>🛒 Carrinho ({cart.length})</button>
                <button onClick={() => setActiveTab("rentals")}>📦 Meus Aluguéis ({rentals.length})</button>
            </nav>

            <main>
                {activeTab === "catalog" && (
                    <div className="catalog-section">
                        {products.length === 0 ? <p>Nenhum produto disponível</p> :
                            products.map((p) => (
                                <div key={p.id} className="product-card">
                                    <img src={p.image_url} alt={p.name} />
                                    <h3>{p.name}</h3>
                                    <p>Tamanho: {p.tamanho}</p>
                                    <p>Cores: {p.cores}</p>
                                    <p>Valor: R$ {p.tempoValor}</p>
                                    <button onClick={() => addToCart(p)}>Adicionar ao Carrinho</button>
                                    <button onClick={() => goToRentPage(p.id)}>Alugar Agora</button>
                                </div>
                            ))
                        }
                    </div>
                )}

                {activeTab === "cart" && (
                    <div className="cart-section">
                        {cart.length === 0 ? <p>Carrinho vazio</p> :
                            cart.map((p) => (
                                <div key={p.id} className="cart-item">
                                    <span>{p.name}</span>
                                    <span>Valor: R$ {p.tempoValor}</span>
                                    <button onClick={() => removeFromCart(p.id)}>❌</button>
                                </div>
                            ))
                        }
                        {cart.length > 0 && <button onClick={confirmRental}>Confirmar Aluguel</button>}
                    </div>
                )}

                {activeTab === "rentals" && (
                    <div className="rentals-section">
                        {rentals.length === 0 ? <p>Nenhum aluguel ainda</p> :
                            rentals.map((r, index) => (
                                <div key={r.backendId || index} className="rental-item">
                                    <span>{r.name}</span>
                                    <span>ID backend: {r.backendId || "-"}</span>
                                    <span>Total: R$ {r.total}</span>
                                </div>
                            ))
                        }
                    </div>
                )}
            </main>

            {toast.message && <div className={`toast-message ${toast.type}`}>{toast.message}</div>}
        </div>
    );
}
