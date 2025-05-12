const express = require('express'); 
const app = express();
const path = require('path');
const dotenv = require('dotenv');
dotenv.config(); 

const PORT = process.env.PORT || 3000;
const DATA_PATH = process.env.DATA_PATH;

const fs = require('fs');

const filePath = path.join(__dirname, DATA_PATH);
const TRAILERFLIX = JSON.parse(require('fs').readFileSync(filePath, 'utf-8'));


app.get('/', (req, res) => {
  const data = {
    pelis: TRAILERFLIX
  };

  res.render('index', data);
});

app.get('/catalogo', (req, res) => {
  res.render('catalogo', { pelis: TRAILERFLIX });
});


app.get('/titulo/:title', (req, res) => {
  const { title } = req.params;
  const resultado = TRAILERFLIX.filter(item =>
    item.titulo.toLowerCase().includes(title.toLowerCase())
  );
  res.json(resultado);
});


app.get('/categoria/:cat', (req, res) => {
  const { cat } = req.params;
  const categoriaFiltrada = TRAILERFLIX.filter(item =>
    item.categoria.toLowerCase() === cat.toLowerCase()
  );
  res.json(categoriaFiltrada);
});

app.get('/reparto/:act', (req, res) => {
  const { act } = req.params;
  const resultado = TRAILERFLIX
    .filter(item => item.reparto.toLowerCase().includes(act.toLowerCase()))
    .map(item => ({
      titulo: item.titulo,
      reparto: item.reparto
    }));
  res.json(resultado);
});


app.get('/trailer/:id', (req, res) => {
  const { id } = req.params;
  const contenido = TRAILERFLIX.find(item => item.id === parseInt(id));

  if (!contenido) {
    return res.status(404).json({ mensaje: "Contenido no encontrado" });
  }

  const respuesta = {
    id: contenido.id,
    titulo: contenido.titulo,
    trailer: contenido?.trailer || "No disponible"
  };

  res.json(respuesta);
});

app.use((req, res) => {
    res.status(404).render('404');
});

app.set('view engine', 'ejs');
app.use(express.static('views'));


// Iniciar servidor
app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
});