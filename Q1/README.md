Sistema de cadastro de habilidades

O que é : um sistema onde o usuário cadastra seu nome, sua idade e alguma habilidade que o usuário tenha.

Função : cadastrar habilidades do usuário.

Ferramentas utilizadas : no frontend foi utilizado JavaScript, Dockerfile, html e css. No Backend foi utilizado python, Dockerfile e txt. O banco de dados utilizado foi o PostgreSQL. O framework utilizado foi o FastAPI

Como executar : no terminal, execute o comando : cp .env.template .env, após isso execute o comando docker-compose up --build, no navegador e acesse a URL : localhost:80.

para apagar os dados registrados que estão no banco de dados, va ate o terminal execute o comando : docker ps, veja o nome que aparecerá na última linha e execute o comando :

```bash
docker exec -it (nome) psql -U admin -d mydb -c "TRUNCATE habilidades RESTART IDENTITY;"
```