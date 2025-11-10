-- name: SaveActivationCode :one
INSERT INTO activation_code (
    cadastro_id,
    activation_code,
    code,
    expires_at,
    status
)
VALUES ($1, $2, $3, $4, $5)
RETURNING cadastro_id, activation_code, code;


