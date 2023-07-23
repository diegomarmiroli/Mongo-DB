const express = require('express');
const app = express();
const path = require('path');

const { connectToCollection, generateId } = require('../connection_db');

const SERVER_ERROR = JSON.stringify({ message: 'Se ha generado un error en el servidor' });
const NOT_FOUND_DATA = JSON.stringify({ message: 'Faltan datos relevantes' });
const MISSING_DATA = JSON.stringify({ message: 'El código no corresponde a un mueble registrado' });

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/v1/muebles', async (req, res) => {
    try {
        const { categoria, precio_lte, precio_gte } = req.query;

        const conn = await connectToCollection('muebles');

        const query = {};
        const sort = {};

        if (categoria) {
            query.categoria = categoria;
            sort.nombre = 1;
        }
        if (precio_lte) {
            if (isNaN(Number(precio_lte))) throw new Error('EL filtro es inválido');
            query.precio = { ...query.precio, $lte: Number(precio_lte) };
            sort.precio = -1;
        }
        if (precio_gte) {
            if (isNaN(Number(precio_gte))) throw new Error('EL filtro es inválido');
            query.precio = { ...query.precio, $gte: Number(precio_gte) };
            sort.precio = 1;
        }

        let muebles = await conn.find(query).sort(sort).toArray();
        res.status(200).send(JSON.stringify({ payload: muebles }));
    } catch (error) {
        res.status(500).send(SERVER_ERROR);
    }
});
app.get('/api/v1/muebles/:codigo', async (req, res) => {
    try {
        const { codigo } = req.params;

        if (!codigo || isNaN(Number(codigo))) throw new Error('El codigo es inválido');

        const conn = await connectToCollection('muebles');

        let mueble = await conn.findOne({ codigo: Number(codigo) });

        if (!mueble) return res.status(400).send(MISSING_DATA);

        res.status(200).send(JSON.stringify({ payload: mueble }));
    } catch (error) {
        res.status(500).send(SERVER_ERROR);
    }
});
app.post('/api/v1/muebles', async (req, res) => {
    try {
        const { categoria, nombre, precio } = req.body;

        if (!categoria || categoria.trim().length < 1) return res.status(400).send(NOT_FOUND_DATA);
        if (!nombre || nombre.trim().length < 1) return res.status(400).send(NOT_FOUND_DATA);
        if (!precio || isNaN(Number(precio))) return res.status(400).send(NOT_FOUND_DATA);

        const conn = await connectToCollection('muebles');
        let data = { categoria, nombre, precio: Number(precio), codigo: await generateId(conn) };
        let mueble = await conn.insertOne(data);
        if (!mueble) throw new Error('Error al insertar el mueble');

        res.status(201).send(JSON.stringify({ message: 'Registro creado', payload: data }));
    } catch (error) {
        res.status(500).send(SERVER_ERROR);
    }
});
app.put('/api/v1/muebles/:codigo', async (req, res) => {
    try {
        const { codigo } = req.params;
        const { categoria, nombre, precio } = req.body;

        if (!codigo || isNaN(Number(codigo))) return res.status(400).send(NOT_FOUND_DATA);
        if (!categoria || categoria.trim().length < 1) return res.status(400).send(NOT_FOUND_DATA);
        if (!nombre || nombre.trim().length < 1) return res.status(400).send(NOT_FOUND_DATA);
        if (!precio || isNaN(Number(precio))) return res.status(400).send(NOT_FOUND_DATA);

        const conn = await connectToCollection('muebles');

        let mueble = await conn.findOne({ codigo: Number(codigo) });
        if (!mueble) return res.status(400).send(MISSING_DATA);

        mueble = { ...mueble, categoria, nombre, precio: Number(precio) };
        await conn.updateOne({ codigo: Number(codigo) }, { $set: mueble });

        res.status(200).send(JSON.stringify({ message: 'Registro actualizado', payload: mueble }));
    } catch (error) {
        res.status(500).send(SERVER_ERROR);
    }
});
app.delete('/api/v1/muebles/:codigo', async (req, res) => {
    try {
        const { codigo } = req.params;

        if (!codigo || isNaN(Number(codigo))) return res.status(400).send(NOT_FOUND_DATA);

        const conn = await connectToCollection('muebles');

        if (!(await conn.findOne({ codigo: Number(codigo) }))) {
            return res.status(400).send(MISSING_DATA);
        }

        await conn.deleteOne({ codigo: Number(codigo) });

        res.status(200).send(JSON.stringify({ message: 'Registro eliminado' }));
    } catch (error) {
        res.status(500).send(SERVER_ERROR);
    }
});
app.use('*', (req, res) => {
    res.status(404).send('<h1>Server not Found</h1>');
});
app.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => console.log(`Example app listening on port ${process.env.SERVER_PORT}!`));
