package service

import (
	"awesomeProject/Internal_temp/model"
	Repository "awesomeProject/Internal_temp/repository"
	db "awesomeProject/db/sqlc"
	"context"
	"database/sql"
	"fmt"
	"os"

	"golang.org/x/crypto/bcrypt"
)

type CadastroService struct {
	Repo        Repository.CadastroRepositoryInterface
	R           Repository.SellersRepositoryInterface
	Twilio      *TwilioService
	CountryCode string
}

func NewCadastroService(
	cadastroRepo Repository.CadastroRepositoryInterface,
) *CadastroService {
	countryCode := os.Getenv("DEFAULT_COUNTRY_CODE")

	twilioService := NewTwilioService()
	return &CadastroService{
		Repo:        cadastroRepo,
		Twilio:      twilioService,
		CountryCode: countryCode,
	}
}

func (s *CadastroService) CreateCadastro(ctx context.Context, data model.CadastroRequest) (db.Cadastro, error) {
	// Gera o hash da senha
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(data.Password), bcrypt.DefaultCost)
	if err != nil {
		return db.Cadastro{}, fmt.Errorf("erro ao gerar hash da senha: %w", err)
	}

	// Cria o cadastro no banco (status pendente)
	arg := db.CreateCadastroParams{
		Name: data.Name,
		Cpf: sql.NullString{
			String: data.CPF,
			Valid:  data.CPF != "",
		},
		Cnpj: sql.NullString{
			String: data.CNPJ,
			Valid:  data.CNPJ != "",
		},
		Email:    data.Email,
		Celular:  data.Celular,
		Password: string(hashedPassword),
		Status:   "pendente",
		ActivationCode: sql.NullString{
			String: data.ActivationCode,
			Valid:  true,
		},
	}

	cadastro, err := s.Repo.CreateCadastroRepository(ctx, arg)
	if err != nil {
		return db.Cadastro{}, fmt.Errorf("erro ao criar cadastro: %w", err)

	}

	return cadastro, nil
}
