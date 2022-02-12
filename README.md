# Backend Feudo Azul Hortência
## Rode o Backend com Docker

### Dependências

Inicialmente, instale localmente as seguintes dependências:

1. Instale o [Docker](https://docs.docker.com/desktop/windows/install/) (Windows);
2. Instale o [Docker](https://docs.docker.com/install/linux/docker-ce/ubuntu/) (Ubuntu);
3. Instale o [Docker Compose](https://docs.docker.com/compose/install/) (Ubuntu).

## Ambiente

* O BackEnd será executado na porta 3000, usando o docker-compose

* O Banco de Dados MongoDB será executado na porta 27017, usando o docker-compose

## Comandos importantes a serem executados

* Compile o docker-compose se você mudou algum serviço do Dockerfile ou o conteúdo que está no diretório rodando o comando ```docker-compose build``` para recompila-lo.

* Para iniciar os contêineres de um serviço já compilado anteriormente, use: ```docker-compose up```

* Para compilar e executar os contêineres em seguida a use flag ```--build:``` junto ao compose up, resultando no seguinte comando ```docker-compose up --build```

* Para parar e remover os containers do docker-compose e serviços envolvidos pela build (contêineres, networks, volumes e imagens), use o comando: ```docker-compose down```

* Caso vc queira parar a execução dos containers sem remove-los. Use o comando: ```docker-compose stop```

* Remova os serviços dos contêineres com o comando: ```docker-compose rm```
