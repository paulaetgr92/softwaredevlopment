CREATE TABLE sales (
                       id BIGSERIAL PRIMARY KEY,
                       produto_id BIGINT NOT NULL REFERENCES PRODUTO(id_roupa) ON DELETE RESTRICT,
                       quantidade INT NOT NULL,
                       tempo_valor DOUBLE PRECISION NOT NULL,
                       total DOUBLE PRECISION,
                       data_venda TIMESTAMP DEFAULT NOW()
);
