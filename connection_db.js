const { MongoClient } = require("mongodb");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const client = new MongoClient(process.env.DATABASE_URL);

async function connect() {
    try {
        return await client.connect();
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function disconnect() {
    try {
        await client.close();
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = { connect, disconnect };
