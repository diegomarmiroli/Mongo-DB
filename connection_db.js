const { MongoClient } = require('mongodb');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const client = new MongoClient(process.env.DATABASE_URL);

/**
 * Crea conexión a la base de datos en mongo
 * @returns MongoDB Connection
 */
async function connect() {
    try {
        return await client.connect();
    } catch (error) {
        console.log(error);
        throw error;
    }
}

/**
 * Desconecta el cliente conectado
 */
async function disconnect() {
    try {
        await client.close();
    } catch (error) {
        console.log(error);
        throw error;
    }
}

/**
 *
 * @param {String} collectionName Colección a la que se conectará
 * @returns Retorna la colección a la que realizar las sentencias
 */
async function connectToCollection(collectionName) {
    const connection = await connect();
    const db = connection.db(process.env.DATABASE_NAME);
    const collection = db.collection(collectionName);

    return collection;
}

/**
 * Ordena el id de mayor a menor, aumenta el primer id en 1 y retorna este id
 * @param {Class} collection Elemento colección obtenida de una conexión
 * @returns {Int}
 */
async function generateId(collection) {
    const documentMaxId = await collection.find().sort({ codigo: -1 }).limit(1).toArray();
    const maxCodigo = documentMaxId[0]?.codigo ?? 0;

    return maxCodigo + 1;
}

module.exports = { connectToCollection, disconnect, generateId };
