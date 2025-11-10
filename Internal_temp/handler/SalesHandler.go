package handler

import (
	"awesomeProject/Internal_temp/service"
	"log"
	"net/http"

	"awesomeProject/Internal_temp/model"

	"github.com/labstack/echo/v4"
)

type SaleHandler struct {
	Service service.SaleServiceInterface
}

func NewSaleHandler(s *service.SaleService) *SaleHandler {
	return &SaleHandler{Service: s}
}

func (h *SaleHandler) CreateSale(c echo.Context) error {
	var req model.SaleRequest

	if err := c.Bind(&req); err != nil {
		log.Println("Erro ao fazer Bind:", err)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Erro ao ler corpo da requisição",
		})
	}

	log.Println("CreateSale request:", req)

	sale, err := h.Service.CreateSale(c.Request().Context(), req)
	if err != nil {
		log.Println("Erro ao criar venda no Service:", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(), // mostra erro real do DB
		})
	}

	log.Println("Venda criada com sucesso:", sale)
	return c.JSON(http.StatusCreated, sale)
}
