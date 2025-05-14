const express = require('express'); 
const app = express();
const path = require('path');
const dotenv = require('dotenv');
dotenv.config(); 

const PORT = process.env.PORT || 3008;
const DATA_PATH = process.env.DATA_PATH;

const fs = require('fs');

const filePath = path.join(__dirname, DATA_PATH);

let TRAILERFLIX = []
try {
  TRAILERFLIX = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
} catch (error) {
  console.error('Error al leer el archivo json', error.message);
  TRAILERFLIX = [];
}


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
  if(resultado.length==0){
        return res.status(404).json({
            mensaje:'No se encontró contenido con ese título'
        })
  };
  res.status(202).json(resultado);
});


app.get('/categoria/:cat', (req, res) => {
  const cat  = req.params.cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  if(cat ==='serie'|| cat==='pelicula'){
    const categoriaFiltrada = TRAILERFLIX.filter(item =>
    item.categoria.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === cat);
    res.status(202).json(categoriaFiltrada);
  }else{
    res.status(404).json({
      mensaje : "Contenido no disponible. Verifique la categoría ingresada"
    })
  }
});

app.get('/reparto/:act', (req, res) => {
  const { act } = req.params;
  const peliReparto = TRAILERFLIX
    .filter(item => item.reparto.trim().toLowerCase().includes(act.trim().toLowerCase()))
    .map(item => ({
      titulo: item.titulo,
      reparto: item.reparto
    }));
  if(peliReparto.length==0){
    return res.status(404).json({
      "mensaje":'No se encontró contenido. Verifique reparto'
    })
  }
  res.status(202).json(peliReparto);
});


app.get('/trailer/:id', (req, res) => {
  const { id } = req.params;

  if(isNaN(id)){
    return res.status(400).json({error: 'El ID debe ser un número'})
  }

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
