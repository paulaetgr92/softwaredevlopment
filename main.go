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
	produtoRepo := Repository.NewProdutosRepository(baseRepo)
	salesRepo := Repository.NewSalesRepository(baseRepo)
	adminRepo := Repository.NewAdminRepository(baseRepo)

	// ⚙️ Serviços
	cadastroService := service.NewCadastroService(cadastroRepo)
	tokenHistService := service.NewUserTokensHistService(tokenHistRepo)
	loginService := service.NewLoginService(loginRepo)
	produtoService := service.NewProdutoService(produtoRepo)
	salesService := service.NewSaleService(*salesRepo)
	adminService := service.NewAdminService(*adminRepo, produtoService)

	// 🎮 Handlers
	cadastroHandler := handler.NewCadastroHandler(cadastroService)
	userTokensHistHandler := handler.NewUserTokensHistHandler(tokenHistService)
	loginHandler := handler.NewLoginHandler(loginService)

	produtoHandler := handler.NewProdutoHandler(produtoService)
	salesHandler := handler.NewSaleHandler(salesService)
	adminHandler := handler.NewAdminHandler(adminService)

	// 🛣️ Configura rotas
	config.SetupRoutes(
		e,
		cadastroHandler,
		userTokensHistHandler,
		loginHandler,
		produtoHandler,
		salesHandler,
		adminHandler,
	)

	// 🖥️ Inicia servidor
	log.Println("🚀 Servidor rodando na porta 8080 (CORS habilitado para http://localhost:3000)")
	e.Logger.Fatal(e.Start(":8080"))
}
