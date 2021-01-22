# Reto Tata Backend / SWAPI API REFACTOR

Este proyecto fué creado con el framework Serverless para aws, implementa la refactorización de todos del api SWAPI (https://swapi.py4e.com/) en el cual se cambian los modelos de todo el dominio y se implementa un modelo de Post o Comentario sobre el cual se ejecutan las funcioalidades CRUD (Crar, Leer, Actualziar y Eliminar).

## Como iniciar

Clonar el repositorio :

`git clone https://github.com/finmavis/swapi-task.git`

Verificar si se tienen instalado nodejs serverless sino intalar con el siguiente comando :

- `npm install -g serverless`

Ir a la carpeta raiz e instalar las dependencias :

- `cd tata-challenge`

- `npm install`

Abrir el archivo de depliegue de infraestructura (serverless.yml) y cambiar el valor de arn del rol de su cuenta en aws:

- `role: [arn:aws:iam::xxxxx:role/xxxxx]`

Desplegar la infraestructura y la funcion lambda :

- `serverless deploy`

Acceder mediante navegador o Postman a las APIs generadas

Ejemplo:
- `GET - https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/films`
- `GET - https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/films/{number}`
- `GET - https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/people`
- `GET - https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/people/{number}`
- `GET - https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/posts`
- `GET - https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/species`
- `GET - https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/species/{number}`
- `GET - https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/starships`
- `GET - https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/starships/{number}`
- `GET - https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/sw`
- `GET - https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/vehicles`
- `GET - https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/vehicles/{number}`
- `GET - https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/planets`
- `GET - https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/planets/{number}`
- `POST - https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/post`
-`{
 `   "postId": "1000",
 `   "nickname": "Marcelo",
 `   "body": "Star War es lo máximo"
 `}
- `GET - https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/post?postId=1000` 
- `DELETE - https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/post`
`{
`    "postId": "1002"
`}
- `PATCH - https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/post`
`{
`    "postId": "1001",
`    "updateKey": "nickname",
`    "updateValue": "Felipillo"
`}
