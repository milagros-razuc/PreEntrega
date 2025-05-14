const express = require('express'); 
const app = express();
const path = require('path');
const dotenv = require('dotenv');
dotenv.config(); 

const PORT = process.env.PORT || 3008;
const DATA_PATH = process.env.DATA_PATH;

const fs = require('fs');

const filePath = path.join(__dirname, DATA_PATH);
<<<<<<< Updated upstream
const TRAILERFLIX = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
=======

let TRAILERFLIX = []
try {
  TRAILERFLIX = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
} catch (error) {
  console.error('Error al leer el archivo json', error.message);
  TRAILERFLIX = [];
}

>>>>>>> Stashed changes


app.get('/', (req, res) => {
  const data = {
    pelis: TRAILERFLIX
  };

  res.status(202).render('index', data);
});

app.get('/catalogo', (req, res) => {
  res.status(202).render('catalogo', { pelis: TRAILERFLIX });
});


app.get('/titulo/:title', (req, res) => {
  const { title } = req.params;
  const resultado = TRAILERFLIX.filter(item =>
    item.titulo.toLowerCase().includes(title.toLowerCase())
  );
  res.status(202).json(resultado);
});


app.get('/categoria/:cat', (req, res) => {
  const { cat } = req.params;
  const categoriaFiltrada = TRAILERFLIX.filter(item =>
    item.categoria.toLowerCase() === cat.toLowerCase()
  );
  res.status(202).json(categoriaFiltrada);
});

app.get('/reparto/:act', (req, res) => {
  const { act } = req.params;
  const resultado = TRAILERFLIX
    .filter(item => item.reparto.toLowerCase().includes(act.toLowerCase()))
    .map(item => ({
      titulo: item.titulo,
      reparto: item.reparto
    }));
  res.status(202).json(resultado);
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

  res.status(202).json(respuesta);
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