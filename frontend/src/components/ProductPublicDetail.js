import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductDetails } from "../api";
import "./ProductPublicDetail.css";

export default function ProductPublicDetail() {
    const { id } = useParams();
    const [produto, setProduto] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await getProductDetails(id);
                setProduto(data);
            } catch (err) {
                console.error("Erro ao carregar produto:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) return <p>Carregando...</p>;
    if (!produto) return <p>Produto não encontrado.</p>;

    return (
        <div className="product-detail">
            <div className="image-container">
                <img
                    src={produto.imagem || "https://via.placeholder.com/300"}
                    alt={produto.nome}
                />
            </div>

            <div className="details">
                <h2>{produto.nome}</h2>
                <p className="descricao">{produto.descricao}</p>
                <p className="categoria">Categoria: {produto.categoria}</p>
                <p className="cor">Cor: {produto.cor}</p>
                <p className="preco">Preço: R$ {produto.preco?.toFixed(2)}</p>

                <Link to="/produtos" className="btn-voltar">
                    ⬅ Voltar
                </Link>
            </div>
        </div>
    );
}
