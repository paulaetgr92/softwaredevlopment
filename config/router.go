package config

import (
	handler2 "awesomeProject/Internal_temp/handler"

	"github.com/labstack/echo/v4"
)

func SetupRoutes(e *echo.Echo, cadastroHandler *handler2.CadastroHandler, userTokenHandler *handler2.UserTokensHistHandler, loginHandler *handler2.LoginHandler, produtoHandler *handler2.ProdutoHandler, salesHandler *handler2.SaleHandler, adminHandler *handler2.AdminHandler) {
	api := e.Group("/api/v1")

	// 📁 Cadastro
	cadastros := api.Group("/cadastros")
	{
		cadastros.POST("", cadastroHandler.CreateCadastro)
	}

	// 📁 Login
	login := api.Group("/login")
	{
		login.POST("", loginHandler.Login)
	}

	adminProdutos := api.Group("/produtos")
	{
		adminProdutos.POST("", produtoHandler.CreateProductHandler)
		adminProdutos.PUT("/:id", produtoHandler.UpdateProdutoByIdHandler)
		adminProdutos.DELETE("/:id", produtoHandler.InativarProdutoHandler)
		adminProdutos.GET("", produtoHandler.ListProdutosHandler)
		adminProdutos.GET("/:id", produtoHandler.GetProductByIdHandler)
	}
	// 📁 Produtos (rotas públicas)
	publicProdutos := api.Group("/produtos")
	{
		publicProdutos.GET("", produtoHandler.ListProdutosHandler)       // Lista todos os produtos
		publicProdutos.GET("/:id", produtoHandler.GetProductByIdHandler) // Detalhe de um produto específico
	}

	// 📁 Admin
	admin := api.Group("/admin")
	{
		admin.POST("/create", adminHandler.CreateAdminHandler)
		admin.POST("/login", adminHandler.CreateLoginAdminHandler)
	}

	// 📁 Vendas
	vendas := api.Group("/sales")
	{
		vendas.POST("", salesHandler.CreateSale)
	}

	// 📁 Ativação (🔐 Nova seção)

	// 📌 Health Check
	api.GET("/health", func(c echo.Context) error {
		return c.JSON(200, map[string]string{"status": "ok"})
	})
}
