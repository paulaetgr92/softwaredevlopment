package main

import (
	"log"
	"net/http"

	"awesomeProject/Internal_temp/handler"
	Repository "awesomeProject/Internal_temp/repository"
	"awesomeProject/Internal_temp/service"
	"awesomeProject/config"
	"awesomeProject/db/dataSrc"
	dbsqlc "awesomeProject/db/sqlc"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	// 📂 Carrega variáveis de ambiente
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️  Aviso: .env não encontrado (seguindo com variáveis padrão)")
	}

	// 🚀 Inicializa Echo
	e := echo.New()

	// 🌐 Middleware CORS (permite acesso do React)
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{
			"http://localhost:3000", // frontend React local
		},
		AllowMethods: []string{
			http.MethodGet,
			http.MethodPost,
			http.MethodPut,
			http.MethodDelete,
			http.MethodOptions,
		},
		AllowHeaders: []string{
			"Content-Type",
			"Authorization",
			"Accept",
		},
		AllowCredentials: true,
	}))

	// 🧩 Conexão com o banco
	conn, err := dataSrc.Connect()
	if err != nil {
		log.Fatal("❌ Erro ao conectar ao banco: ", err)
	}
	queries := dbsqlc.New(conn)

	// 🧱 Repositórios
	baseRepo := Repository.NewBaseRepository(queries, conn)
	cadastroRepo := Repository.NewCadastroNewRepository(baseRepo)
	tokenHistRepo := Repository.NewUserTokensHistRepository(*baseRepo)
	loginRepo := Repository.NewLoginRepository(baseRepo)
	sellerRepo := Repository.NewSellerRepository(*baseRepo)
	produtoRepo := Repository.NewProdutosRepository(baseRepo)
	salesRepo := Repository.NewSalesRepository(baseRepo)
	adminRepo := Repository.NewAdminRepository(baseRepo)
	activationRepo := Repository.NewActivationNewRepository(baseRepo)

	// ⚙️ Serviços
	sellerService := service.NewSellerService(sellerRepo, activationRepo)
	cadastroService := service.NewCadastroService(cadastroRepo, activationRepo)
	tokenHistService := service.NewUserTokensHistService(tokenHistRepo)
	loginService := service.NewLoginService(loginRepo)
	produtoService := service.NewProdutoService(produtoRepo)
	salesService := service.NewSaleService(*salesRepo)
	adminService := service.NewAdminService(*adminRepo, produtoService)
	activationService := service.NewActivationService(activationRepo)

	// 🎮 Handlers
	cadastroHandler := handler.NewCadastroHandler(cadastroService)
	userTokensHistHandler := handler.NewUserTokensHistHandler(tokenHistService)
	loginHandler := handler.NewLoginHandler(loginService)
	sellerHandler := handler.NewSellerHandler(sellerService)
	produtoHandler := handler.NewProdutoHandler(produtoService)
	salesHandler := handler.NewSaleHandler(salesService)
	adminHandler := handler.NewAdminHandler(adminService)
	activationHandler := handler.NewActivationHandler(activationService)

	// 🛣️ Configura rotas
	config.SetupRoutes(
		e,
		cadastroHandler,
		userTokensHistHandler,
		loginHandler,
		sellerHandler,
		produtoHandler,
		salesHandler,
		adminHandler,
		activationHandler,
	)

	// 🖥️ Inicia servidor
	log.Println("🚀 Servidor rodando na porta 8080 (CORS habilitado para http://localhost:3000)")
	e.Logger.Fatal(e.Start(":8080"))
}
