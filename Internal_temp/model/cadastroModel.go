package model

type CadastroRequest struct {
	Id             int64  `json:"id"`
	Name           string `json:"name"`
	ActivationCode string `json:"activationCode"`
	CPF            string `json:"cpf"`
	CNPJ           string `json:"cnpj"`
	Celular        string `json:"celular"`
	Email          string `json:"email"`
	Password       string `json:"password"`
	Status         string `json:"status"`
}
