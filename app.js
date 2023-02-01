const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

//Haciendo referencia al constructor de express
//Creación de objeto, para acceder a todos los metodos y propiedades de express
const app = express();
//Especificar el uso de JSON
app.use(express.json());
app.use(cors());

//Conexión a mysql
//Esblecer paramatros de conexión
const connec = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'articulosdb'
});

//Verificando la conexión a mySQL
connec.connect(function(error){
    if(error){
        throw error;
    }else{
        console.log("Conexión a mysql exitosa");
    }
});

//Cuando accede a la raiz nos muestre algo
app.get('/', function(req,res){
    res.send('Ruta INICIO IvanDroid');
})


//Mostrar todo los articulos
app.get('/api/articulos', (req, res)=>{
    connec.query('SELECT * FROM articulos', (error,filas)=>{
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    });
});

//Mostrar un solo articulo
app.get('/api/articulos/:id', (req, res)=>{
    connec.query('SELECT * FROM articulos WHERE id = ?',[req.params.id], (error,fila)=>{
        if(error){
            throw error;
        }else{
            res.send(fila);
            //Solicitar un dato en especifico
            //Se pone [0] porque solo es un dato que se obtine del JSON
            //res.send(fila[0].descripcion);
        }
    });
});

//Insertar un articulo
app.post('/api/articulos', (req, res)=>{
    /*data es un objeto, con el metodo req de peticion
    se cargan los datos que se enviaran*/
    let data = {descripcion:req.body.descripcion, precio:req.body.precio, stock:req.body.stock};
    //Query, ? hace referencia a data
    let sql = "INSERT INTO articulos SET ?";
    //sql es la query sentecia a ejecutar
    //data son los datos a insertar enviados por referencia
    //la function, se encarga de mostrar los resultados o el error
    connec.query(sql, data, function(error, results){
        if(error){
            throw error;
        }else{
            res.send(results);
        }

    });
});

//Editar articulo
//Se coloca el :id para referencias al articulo que se modificará
app.put('/api/articulos/:id', (req, res)=>{
    //Variables para recoger lo valores ha actualizar
    let id = req.params.id;
    let descripcion = req.body.descripcion;
    let precio = req.body.precio;
    let stock = req.body.stock;
    //query
    let sql = "UPDATE articulos SET descripcion = ?, precio = ?, stock = ? WHERE id = ?";

    //la query, los datos mediante un arreglo, funcion para cacturar el resultado o error
    connec.query(sql, [descripcion, precio, stock, id], function(error, results){
        if(error){
            throw error;
        }else{
            res.send(results);
        }
    });
});

//Eliminar articulo
app.delete('/api/articulos/:id', (req, res)=>{
    connec.query("DELETE FROM articulos WHERE id = ?", [req.params.id], function(error, filas){
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    });
});

/*Se crea una variable de entorno para el puerto
y así se evita el conflicto del puerto ocupado por otro porgrama*/
//Para setear el puerto desde windows "set PUERTO=xxxx"
//Para setear el puerto desde linux "export PUERTO=xxxx"
const puerto = process.env.PUERTO || 3000;

//Escuchar las conexiones
//puerto, función(recoger e imprimir salidas del servidor)
app.listen(puerto, function(){
    console.log("Servidor Ok en puerto: "+puerto);
});