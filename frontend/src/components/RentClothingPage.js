import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Exemplo de mockProducts — você pode substituir pela chamada real à API
const mockProducts = [
    { id: 1, categoria: "Vestido", tamanho: "M", cores: "Azul", tempoValor: 50 },
    { id: 2, categoria: "Camisa", tamanho: "G", cores: "Preto", tempoValor: 30 },
    { id: 3, categoria: "Saia", tamanho: "P", cores: "Vermelho", tempoValor: 40 },
];

const RentClothingPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = () => {
            // Busca o produto pelo ID no mockProducts
            const foundProduct = mockProducts.find((p) => p.id === parseInt(id));
            if (foundProduct) {
                setProduct(foundProduct);
            } else {
                setError("Produto não encontrado.");
            }
            setLoading(false);
        };

        fetchProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]); // Aqui adicionamos só o id como dependência

    if (loading) return <p>Carregando produto...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="rent-clothing-page">
            <h1>Detalhes do Produto</h1>
            <p>Categoria: {product.categoria}</p>
            <p>Tamanho: {product.tamanho}</p>
            <p>Cores: {product.cores}</p>
            <p>Valor: R$ {product.tempoValor}</p>
        </div>
    );
};

export default RentClothingPage;
