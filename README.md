# TechNation Teste Técnico
<div align="center">
  <img src="https://github.com/user-attachments/assets/5322079c-b4e8-45b9-9d9d-2bb57f1e0154" />
</div>

##

Olá, equipe de recrutamento da TechNation,

Estou muito feliz pela oportunidade de participar deste processo seletivo e por ter completado o desafio.

Para este projeto, utilizei as seguintes tecnologias:

- .Net 6.0
- EntityFrameworkCore 6.0.10
- Newtonsoft.Json 13.0.3
- Bootstrap 4.5.2
- Chart.js (para os gráficos)
- Font-Awsome 5.15.4
- Sweetalert
- JavaScript
- CSS
- HTML

Segue abaixo mais algumas imagens:

<div align="center">
  <img src="https://github.com/user-attachments/assets/373e3ddb-7413-4f15-b6cc-46244140b45b" />
  <img src="https://github.com/user-attachments/assets/4591f78a-f737-4cf3-bc5f-72d86e796078" />
  <img src="https://github.com/user-attachments/assets/9400e92f-2484-49ee-a712-dba1fe48cdaa" />
</div>

##

# Instruções e observações:

O banco de dados utilizado está localizado na raiz do projeto, no arquivo chamado technationdb.

Configurei o container e os dados do Docker na raiz do projeto. No entanto, encontrei um problema com o banco de dados que não consegui resolver a tempo. Portanto, ao acessar o código via Docker, a parte visual será exibida corretamente, mas os dados do banco não serão carregados.

Se você executar o projeto diretamente pelo Visual Studio, o código será carregado conforme mostrado na primeira imagem.

A conexão com o banco de dados está configurada para acessar diretamente pelo Windows, sem a necessidade de autenticação de usuário.

# Instruções para Build e Execução:

Para construir a imagem do Docker, use o seguinte comando: docker build -t technationex .

Para iniciar o container e o código, use o seguinte comando: docker run -p 5000:80 technationex

Ao iniciar o código, acesse a página via HTTP, não HTTPS: http://localhost:5000
