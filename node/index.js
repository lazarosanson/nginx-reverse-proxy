const express = require('express');
const { faker } = require('@faker-js/faker');
const mysql = require('mysql2/promise');

const app = express();
const port = 3000;

const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'rh'
};

async function generateAndInsertName() {
    const randomName = faker.person.fullName();
  
    const connection = await mysql.createConnection(config);
  
    try {
      await connection.query('INSERT INTO people(name) values(?)', [randomName]);
    } catch (err) {
      console.error(err);
    } finally {
      await connection.end();
    }
  }

async function listNames() {
    const connection = await mysql.createConnection(config);
  
    try {
        return await connection.query('SELECT id, name FROM people');
    } catch (err) {
      console.error(err);
    } finally {
      await connection.end();
    }
}

function generateHtml(rows) {
    const namesList = rows.map(row => `<li>${row.name}</li>`).join('');

    return `<html>
                <h1>Full Cycle Rocks!</h1>
                <h2>- Lista de nomes cadastrada no banco de dados:</h2>
                <ul style="list-style-type: none; padding-left: 1em;">
                    ${namesList}
                </ul>
            </html>`;
}

app.get('/', async (req, res) => {
    await generateAndInsertName();
    const [rows] = await listNames();
    html = generateHtml(rows);
    res.send(html);
  });

app.listen(port, () => {
    console.log("Running at port " + port)
})
