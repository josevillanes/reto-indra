'use strict';

const AWS = require('aws-sdk');
const https = require('https');
const objectMapper = require('object-mapper');

AWS.config.update({
    region: 'us-east-2'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName = 'tposts';
const swApiPath = 'https://swapi.py4e.com/api';
const healthPath = '/health';

// Paths for StarWars API
const swPath = '/sw';
const swPathPeople = '/people';
const swPathPlanets = '/planets';
const swPathFilms = '/films';
const swPathSpecies = '/species';
const swPathVehicles = '/vehicles';
const swPathStarships = '/starships';

const postPath = '/post';
const postsPath = '/posts';

module.exports.handler = async function(event) {
    console.log('Request event: ', event);
    let response;
    switch (true) {
        case event.httpMethod === 'GET' && event.path === healthPath:
            response = buildResponse(200);
            break;

        // Methods for external StarWars API
        case event.httpMethod === 'GET' && event.path === swPath:
            response = getSW('/');
            break;     
        case event.httpMethod === 'GET' && event.path.includes(swPathPeople):
            response = getSW(event.path);
            break;     
        case event.httpMethod === 'GET' && event.path.includes(swPathPlanets):
            response = getSW(event.path);
            break;     
        case event.httpMethod === 'GET' && event.path.includes(swPathFilms):
            response = getSW(event.path);
            break;     
        case event.httpMethod === 'GET' && event.path.includes(swPathSpecies):
            response = getSW(event.path);
            break;     
        case event.httpMethod === 'GET' && event.path.includes(swPathVehicles):
            response = getSW(event.path);
            break;     
        case event.httpMethod === 'GET' && event.path.includes(swPathStarships):
            response = getSW(event.path);
            break;     
            
        case event.httpMethod === 'GET' && event.path === postPath:
            response = getPost(event.queryStringParameters.postId);
            break;
        case event.httpMethod === 'GET' && event.path === postsPath:
            response = getPosts();
            break;
        case event.httpMethod === 'POST' && event.path === postPath:
            response = await savePost(JSON.parse(event.body));
            break;            
        case event.httpMethod === 'PATCH' && event.path === postPath:
            const requestBody = JSON.parse(event.body);
            response = await modifyPost(requestBody.postId, requestBody.updateKey, requestBody.updateValue);
            break;                        
        case event.httpMethod === 'DELETE' && event.path === postPath:
            response = await deletePost(JSON.parse(event.body).postId);
            break;       
        default:
            response =  buildResponse(404, '404 Not Found');
    }

    return response;
}

async function getSW(category) {
     let dataString = '';

    const response = await new Promise((resolve, reject) => {
        const req = https.get(swApiPath + category + '/', function(res) {
          res.on('data', chunk => {
            dataString += chunk;
          });
          res.on('end', () => {
            resolve({
                statusCode: 200,
                body: translate(dataString)
            });
          });
        });
        
        req.on('error', (e) => {
          reject({
              statusCode: 500,
              body: 'Something went wrong!'
          });
        });
    });
    
    return response;
}

async function getPost(postId) {
    const params = {
        TableName: dynamodbTableName,
        Key: {
            'postId': postId
        }
    }
    return await dynamodb.get(params).promise().then((response) => {
        return buildResponse(200, response.Item);
    }, (error) => {
        console.error('Error', error);
    });
}

async function getPosts() {
    const params = {
        TableName: dynamodbTableName,
    }
    const allPosts = await scanDynamoRecords(params, []);
    const body = {
        posts: allPosts
    }
    return buildResponse(200, body);
}

async function scanDynamoRecords(scanParams, itemArray) {
    try{
        const dynamoData = await dynamodb.scan(scanParams).promise();
        itemArray = itemArray.concat(dynamoData.Items);
        if (dynamoData.LastEvaluatedKey) {
            scanParams.ExclusiveStartkey = dynamoData.LastEvaluatedKey;
            return await scanDynamoRecords(scanParams, itemArray);
        }
        return itemArray;
    } catch(error) {
        console.error('Error', error);
    }
}

async function savePost(requestBody) {
    const params = {
        TableName: dynamodbTableName,
        Item: requestBody
    }
    
    return await dynamodb.put(params).promise().then(() => {
        const body = {
            Operation: 'SAVE',
            Message: 'SUCCESS',
            Item: requestBody
        }
        return buildResponse(200, body);
    }, (error) => {
        console.error('Error', error);
    });
}

async function modifyPost(postId, updateKey, updateValue) {
    const params = {
        TableName: dynamodbTableName,
        Key: {
            'postId': postId
        }, 
        UpdateExpression: `set ${updateKey} = :value`,
        ExpressionAttributeValues: {
            ':value': updateValue
        }, 
        ReturnValues: 'UPDATED_NEW'
    }
    
    return await dynamodb.update(params).promise().then((response) => {
        const body = {
            Operation: 'UPDATE',
            Message: 'SUCCESS',
            Item: response
        }
        return buildResponse(200, body);
    }, (error) => {
        console.error('Error', error);
    });
}

async function deletePost(postId) {
    const params = {
        TableName: dynamodbTableName,
        Key: {
            'postId': postId
        }, 
        ReturnValues: 'ALL_OLD'
    }
    return await dynamodb.delete(params).promise().then((response) => {
        const body = {
            Operation: 'DELETE',
            Message: 'SUCCESS',
            Item: response
        }
        return buildResponse(200, body);
    }, (error) => {
        console.error('Error', error);
    });
}

function buildResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }
}

function translate(dataString){

    var src = JSON.parse(dataString);
    
    var map = {
      
      //Principal     
       
      "people": "personas",
      "planets": "planetas",
      "films": "peliculas",
      "species": "especies",
      "vehicles": "vehiculos",
      "starships": "naves",
      
      //Comunes individuales
      
      "count":"cantidad",
      "next":"siguiente",
      "previous":"anterior",
      
      //Comunes listas
      
      "results[].created": "resultados[].creado",
      "results[].edited": "resultados[].editado",
      "results[].url": "resultados[].url",
      
      //starships - naves
      
      "name":"nombre",
      "model":"modelo",
      "manufacturer": "marca",
      "cost_in_credits": "costo_en_creditos",
      "length": "largo",
      "max_atmosphering_speed": "velocidad_admosferica_maxima",
      "crew": "aforo",
      "passengers": "pasajeros",
      "cargo_capacity": "capacidad_de_carga",
      "consumables": "consumibles",
      "hyperdrive_rating": "ratio_hipermanejo",
      "MGLT": "MGLT",
      "starship_class": "clase_nave",
      "pilots": "pilotos",
      "films": "peliculas",
      "results[].name":"resultados[].nombre",
      "results[].model":"resultados[].modelo",
      "results[].manufacturer": "resultados[].marca",
      "results[].cost_in_credits": "resultados[].costo_en_creditos",
      "results[].length": "resultados[].largo",
      "results[].max_atmosphering_speed": "resultados[].velocidad_admosferica_maxima",
      "results[].crew": "resultados[].aforo",
      "results[].passengers": "resultados[].pasajeros",
      "results[].cargo_capacity": "resultados[].capacidad_de_carga",
      "results[].consumables": "resultados[].consumibles",
      "results[].hyperdrive_rating": "resultados[].ratio_hipermanejo",
      "results[].MGLT": "resultados[].MGLT",
      "results[].starship_class": "resultados[].clase_nave",
      "results[].pilots": "resultados[].pilotos",
      "results[].films": "resultados[].peliculas",
      	  
      //films - peliculas	
        
      "title": "titulo", 
      "episode_id": "episodio", 
      "opening_crawl": "resumen", 
      "director": "director", 
      "producer": "productor", 
      "release_date": "fecha_estreno", 
      "characters": "personajes", 
      "planets": "planetas", 
      "starships": "naves", 
      "vehicles": "vehiculos", 
      "species": "especies",	  
      "results[].title": "resultados[].titulo", 
      "results[].episode_id": "resultados[].episodio", 
      "results[].opening_crawl": "resultados[].resumen", 
      "results[].director": "resultados[].director", 
      "results[].producer": "resultados[].productor", 
      "results[].release_date": "resultados[].fecha_estreno", 
      "results[].characters": "resultados[].personajes", 
      "results[].planets": "resultados[].planetas", 
      "results[].starships": "resultados[].naves", 
      "results[].vehicles": "resultados[].vehiculos", 
      "results[].species": "resultados[].especies",
      
      //people - personas
      
      "name": "nombre", 
      "height": "altura", 
      "mass": "peso", 
      "hair_color": "color_cabello", 
      "skin_color": "color_piel", 
      "eye_color": "color_ojos", 
      "birth_year": "nacimiento", 
      "gender": "genero", 
      "homeworld": "planeta", 
      "films": "peliculas", 
      "species": "especies", 
      "vehicles": "vehiculos", 
      "starships": "naves", 
      "results[].name": "resultados[].nombre", 
      "results[].height": "resultados[].altura", 
      "results[].mass": "resultados[].peso", 
      "results[].hair_color": "resultados[].color_cabello", 
      "results[].skin_color": "resultados[].color_piel", 
      "results[].eye_color": "resultados[].color_ojos", 
      "results[].birth_year": "resultados[].nacimiento", 
      "results[].gender": "resultados[].genero", 
      "results[].homeworld": "resultados[].planeta", 
      "results[].films": "resultados[].peliculas", 
      "results[].species": "resultados[].especies", 
      "results[].vehicles": "resultados[].vehiculos", 
      "results[].starships": "resultados[].naves", 
      
      //planets - planetas
      
      "name": "nombre", 
      "rotation_period": "periodo_rotacion", 
      "orbital_period": "periodo_orbital", 
      "diameter": "diametro", 
      "climate": "clima", 
      "gravity": "gravedad", 
      "terrain": "terreno", 
      "surface_water": "superficie_agua", 
      "population": "poblacion", 
      "residents": "residentes", 
      "films": "peliculas",
      "results[].name": "resultados[].nombre", 
      "results[].rotation_period": "resultados[].periodo_rotacion", 
      "results[].orbital_period": "resultados[].periodo_orbital", 
      "results[].diameter": "resultados[].diametro", 
      "results[].climate": "resultados[].clima", 
      "results[].gravity": "resultados[].gravedad", 
      "results[].terrain": "resultados[].terreno", 
      "results[].surface_water": "resultados[].superficie_agua", 
      "results[].population": "resultados[].poblacion", 
      "results[].residents": "resultados[].residentes", 
      "results[].films": "resultados[].peliculas",
      
      //species - especies
      
      "name": "nombre", 
      "classification": "clasificacion", 
      "designation": "designacion", 
      "average_height": "altura_promedio", 
      "skin_colors": "colores_piel", 
      "hair_colors": "colores_cabello", 
      "eye_colors": "colores_ojos", 
      "average_lifespan": "promedio_vida", 
      "homeworld": "planeta", 
      "language": "lenguaje", 
      "people": "personas", 
      "films": "peliculas",
      "results[].name": "resultados[].nombre",
      "results[].classification": "resultados[].clasificacion", 
      "results[].designation": "resultados[].designacion", 
      "results[].average_height": "resultados[].altura_promedio", 
      "results[].skin_colors": "resultados[].colores_piel", 
      "results[].hair_colors": "resultados[].colores_cabello", 
      "results[].eye_colors": "resultados[].colores_ojos", 
      "results[].average_lifespan": "resultados[].promedio_vida", 
      "results[].homeworld": "resultados[].planeta", 
      "results[].language": "resultados[].lenguaje", 
      "results[].people": "resultados[].personas", 
      "results[].films": "resultados[].peliculas",
      
      //vehicles - vehiculos
      
      "name": "nombre", 
      "model": "modelo", 
      "manufacturer": "marca", 
      "cost_in_credits": "costo_en_creditos", 
      "length": "largo", 
      "max_atmosphering_speed": "velocidad_admosferica_maxima", 
      "crew": "aforo", 
      "passengers": "pasajeros", 
      "cargo_capacity": "capacidad_de_carga", 
      "consumables": "consumibles", 
      "vehicle_class": "clase_vehiculo", 
      "pilots": "pilotos", 
      "films": "peliculas", 
      "name": "resultados[].nombre", 
      "model": "resultados[].modelo", 
      "manufacturer": "resultados[].marca", 
      "cost_in_credits": "resultados[].costo_en_creditos", 
      "length": "resultados[].largo", 
      "max_atmosphering_speed": "resultados[].velocidad_admosferica_maxima", 
      "crew": "resultados[].aforo", 
      "passengers": "resultados[].pasajeros", 
      "cargo_capacity": "resultados[].capacidad_de_carga", 
      "consumables": "resultados[].consumibles", 
      "vehicle_class": "resultados[].clase_vehiculo", 
      "pilots": "resultados[].pilotos", 
      "films": "resultados[].peliculas"

    };
    
    var dest = objectMapper(src, map);

    return JSON.stringify(dest);
    
}
