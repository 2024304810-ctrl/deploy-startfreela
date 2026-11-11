const express = require('express');
const app = express();
const path = require('path');
const Socket = require('./app/notifications/chat/Socket');
const socket = new Socket(); 
require('dotenv').config();
const conectarBanco = require('./app/repositories/database/database');
//const ClientWhatsapp = require('./app/notifications/whatsapp/password_reset/ClientWhatsapp');
//const client = new ClientWhatsapp();
const cookieParser = require('cookie-parser');
const { engine } = require('express-handlebars');
const http = require('http');
const WebSocket = require('ws');
const helpers = require('./helpers/handlebars.helpers');

const server = http.createServer(app);

const wss = new WebSocket.Server({
    server: server
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.engine('handlebars', engine());

app.engine('handlebars', engine({
    helpers
}))

app.set('view engine', 'handlebars');

app.set('views', path.join(__dirname, "views"));

const routes_pages = require('./app/routes/routes.pages');

app.use(routes_pages);

const routes_assets = require('./app/routes/routes.assets');
app.use(routes_assets);

conectarBanco();

const routes_app = require('./app/routes/routes');
app.use(routes_app);

//client.clientWhatsapp();

socket.conectar(wss);

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views/status/404/404.html'))
});

server.listen(process.env.PORTA, () => {
    console.log('servidor ligado');
})