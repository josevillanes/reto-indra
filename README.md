# Reto Indra Backend / SWAPI API REFACTOR

Este proyecto fué creado con el framework Serverless para aws, implementa la refactorización de todos los endpoints del api de prueba SWAPI (https://swapi.py4e.com/) en el cual se cambian los modelos de todo el dominio del ingles al español y se implementa un nuevo modelo: Post o Comentario sobre el cual se ejecutan las funcioalidades CRUD (Crear, Leer, Actualizar y Eliminar) sobre la base de datos Dynamo.

La arquitectura empleada fue la siguiente:

![N|Solid](https://drive.google.com/uc?id=1icmMK7tuBrUaQgF62xIpzj7nOU_gMYdC)

## Como iniciar

Clonar el repositorio :

`git clone https://github.com/josevillanes/reto-indra`

Verificar si se tienen instalado nodejs serverless sino intalar con el siguiente comando :

- `npm install -g serverless`

Ir a la carpeta raiz e instalar las dependencias :

- `cd reto-indra`

- `npm install`

Abrir el archivo de depliegue de infraestructura (serverless.yml) y cambiar el valor de arn del rol de su cuenta en aws:

- `role: [arn:aws:iam::xxxxx:role/xxxxx]`

Desplegar la infraestructura y la funcion lambda :

- `serverless deploy`

Acceder mediante navegador o Postman a las APIs generadas

## Aplicación en linea

A continuación se tiene desplegada la aplicación para la consulta en linea. Para una navegación directa se recomienda instalar la extensión JSON Formater al navegador.

Endpoints refactorizados (ingles a español):

- GET [https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/sw]
- GET [https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/films]
- GET [https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/films/1/]
- GET [https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/people]
- GET [https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/people/2/]
- GET [https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/species]
- GET [https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/species/3/]
- GET [https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/starships]
- GET [https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/starships/10/]
- GET [https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/vehicles]
- GET [https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/vehicles/4/]
- GET [https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/planets]
- GET [https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/planets/6/]

Endpoints del CRUD del modelo Comentarios:

- GET [https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/posts]
- GET [https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/post?postId=1050]
- POST [https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/post]
	`Body {"postId": "1050","nickname": "Marcelo","body": "Star War es lo máximo"}`
- PATCH [https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/post]
	`Body {"postId": "1050", "updateKey": "nickname", "updateValue": "Felipillo"}`
- DELETE [https://qbglbhp0z2.execute-api.us-east-2.amazonaws.com/dev/post]
	`Body {"postId": "1050"}`
