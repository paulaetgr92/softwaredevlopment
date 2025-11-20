CREATE TABLE activation_code (
                                 cadastro_id BIGINT PRIMARY KEY REFERENCES cadastro (id) ON DELETE CASCADE,
                                 activation_code VARCHAR(255) NOT NULL,
                                 status VARCHAR(50) DEFAULT 'pendente',
    Code VARCHAR(100),
                                 created_at TIMESTAMP DEFAULT now(),
                                 updated_at TIMESTAMP DEFAULT now(),
    expires_at TIMESTAMP DEFAULT now()
);
