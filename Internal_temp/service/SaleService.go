package service

import (
	"awesomeProject/Internal_temp/model"
	"awesomeProject/Internal_temp/repository"
	db "awesomeProject/db/sqlc"
	"context"
	"database/sql"
)

type SaleService struct {
	repo Repository.SalesNewRepository
}

func NewSaleService(repo Repository.SalesNewRepository) *SaleService {
	return &SaleService{
		repo: repo,
	}
}

func (s *SaleService) CreateSale(ctx context.Context, request model.SaleRequest) (db.Sale, error) {
	arg := db.CreateSaleParams{
		ProdutoID: sql.NullInt64{
			Int64: request.ProdutoID,
			Valid: true,
		},
		Quantidade: sql.NullInt32{
			Int32: request.Quantidade,
			Valid: true,
		},
		TempoValor: sql.NullFloat64{
			Float64: float64(request.TempoValor),
			Valid:   true,
		},
	}

	sale, err := s.repo.CreateSale(ctx, arg)
	if err != nil {
		return db.Sale{}, err
	}

	return sale, nil
}
