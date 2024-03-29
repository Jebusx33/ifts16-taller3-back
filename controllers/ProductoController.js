'use strict'

var Producto = require('../models/Producto');
var Inventario = require('../models/inventario');
//var Review = require('../models/review');
var fs = require('fs');
var path = require('path');


const listar_inventario_producto_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {

            var id = req.params['id'];

            var reg = await Inventario.find({ producto: id }).populate('admin').sort({ createdAt: -1 });
            res.status(200).send({ data: reg });

        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const eliminar_inventario_producto_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            //OBTENER ID DEL INVENTARIO
            var id = req.params['id'];

            //ELIMINAR INVENTARIO
            let reg = await Inventario.findByIdAndRemove({ _id: id });

            //OBTENER EL REGISTRO DE PRODUCTO
            let prod = await Producto.findById({ _id: reg.producto });

            //CALCULAR EL NUEVO STOCK
            let nuevo_stock = parseInt(prod.stock) - parseInt(reg.cantidad);

            //ACTUALICACION DEL NUEVO STOCK AL PRODUCTO
            let producto = await Producto.findByIdAndUpdate({ _id: reg.producto }, {
                stock: nuevo_stock
            })

            res.status(200).send({ data: producto });

        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const registro_inventario_producto_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {

            let data = req.body;

            let reg = await Inventario.create(data);

            //OBTENER EL REGISTRO DE PRODUCTO
            let prod = await Producto.findById({ _id: reg.producto });

            //CALCULAR EL NUEVO STOCK
            //STOCK ACTUAL         //STOCK A AUMENTAR
            let nuevo_stock = parseInt(prod.stock) + parseInt(reg.cantidad);

            //ACTUALICACION DEL NUEVO STOCK AL PRODUCTO
            let producto = await Producto.findByIdAndUpdate({ _id: reg.producto }, {
                stock: nuevo_stock
            })

            res.status(200).send({ data: reg });

        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const eliminar_producto_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {

            var id = req.params['id'];

            let reg = await Producto.findByIdAndRemove({ _id: id });
            res.status(200).send({ data: reg });

        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const actualizar_producto_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            let id = req.params['id'];
            let data = req.body;

            if (req.files) {
                //SI HAY IMAGEN
                var img_path = req.files.portada.path;
                var name = img_path.split('\\');
                var portada_name = name[2];


                let reg = await Producto.findByIdAndUpdate({ _id: id }, {
                    titulo: data.titulo,
                    stock: data.stock,
                    precio: data.precio,
                    categoria: data.categoria,
                    descripcion: data.descripcion,
                    contenido: data.contenido,
                    portada: portada_name
                });

                fs.stat('./uploads/productos/' + reg.portada, function(err) {
                    if (!err) {
                        fs.unlink('./uploads/productos/' + reg.portada, (err) => {
                            if (err) throw err;
                        });
                    }
                })

                res.status(200).send({ data: reg });
            } else {
                //NO HAY IMAGEN
                let reg = await Producto.findByIdAndUpdate({ _id: id }, {
                    titulo: data.titulo,
                    stock: data.stock,
                    precio: data.precio,
                    categoria: data.categoria,
                    descripcion: data.descripcion,
                    contenido: data.contenido,
                });
                res.status(200).send({ data: reg });
            }

        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const registro_producto_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            let data = req.body;
            var img_path = req.files.portada.path;
            var name = img_path.split('\\');
            var portada_name = name[2];

            data.slug = data.titulo.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            data.portada = portada_name;
            let reg = await Producto.create(data);

            res.status(200).send({ data: reg });;
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    }
}

const listar_productos_admin = async function(req, res) {
    if (req.user) {
        var productos = await Producto.find();
        res.status(200).send({ data: productos });
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const listar_variedades_productos_admin = async function(req, res) {
    if (req.user) {
        var productos = await Variedad.find().populate('producto');
        res.status(200).send({ data: productos });
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const obtener_producto_admin = async function(req, res) {
    if (req.user) {
        var id = req.params['id'];

        try {
            var reg = await Producto.findById({ _id: id });
            res.status(200).send({ data: reg });
        } catch (error) {
            res.status(200).send({ data: undefined });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const actualizar_producto_variedades_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            let id = req.params['id'];
            let data = req.body;

            let reg = await Producto.findByIdAndUpdate({ _id: id }, {
                titulo_variedad: data.titulo_variedad,
                variedades: data.variedades
            });
            res.status(200).send({ data: reg });

        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const agregar_imagen_galeria_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            let id = req.params['id'];
            let data = req.body;

            var img_path = req.files.imagen.path;
            var name = img_path.split('\\');
            var imagen_name = name[2];

            let reg = await Producto.findByIdAndUpdate({ _id: id }, {
                $push: {
                    galeria: {
                        imagen: imagen_name,
                        _id: data._id
                    }
                }
            });

            res.status(200).send({ data: reg });

        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}


const eliminar_imagen_galeria_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            let id = req.params['id'];
            let data = req.body;


            let reg = await Producto.findByIdAndUpdate({ _id: id }, { $pull: { galeria: { _id: data._id } } });
            res.status(200).send({ data: reg });

        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

//---METODOS PUBLICOS----------------------------------------------------

const listar_productos_publico = async function(req, res) {
    var filtro = req.params['filtro'];

    let reg = await Producto.find({ titulo: new RegExp(filtro, 'i') }).sort({ createdAt: -1 });
    res.status(200).send({ data: reg });
}

const obtener_productos_slug_publico = async function(req, res) {
    var slug = req.params['slug'];

    let reg = await Producto.findOne({ slug: slug });
    res.status(200).send({ data: reg });
}

const listar_productos_recomendados_publico = async function(req, res) {
    var categoria = req.params['categoria'];

    let reg = await Producto.find({ categoria: categoria }).sort({ createdAt: -1 }).limit(8);
    res.status(200).send({ data: reg });
}

const listar_productos_nuevos_publico = async function(req, res) {
    let reg = await Producto.find().sort({ createdAt: -1 }).limit(8);
    res.status(200).send({ data: reg });
}

const listar_productos_masvendidos_publico = async function(req, res) {
    let reg = await Producto.find().sort({ nventas: -1 }).limit(8);
    res.status(200).send({ data: reg });
}

//const obtener_reviews_producto_publico = async function(req, res) {
//    let id = req.params['id'];

//      let reviews = await Review.find({ producto: id }).populate('cliente').sort({ createdAt: -1 });
//       res.status(200).send({ data: reviews });
//}


module.exports = {

    listar_inventario_producto_admin,
    eliminar_inventario_producto_admin,
    registro_inventario_producto_admin,
    eliminar_producto_admin,
    actualizar_producto_admin,
    actualizar_producto_variedades_admin,
    obtener_producto_admin,
    listar_productos_admin,
    registro_producto_admin,
    listar_variedades_productos_admin,
    agregar_imagen_galeria_admin,
    eliminar_imagen_galeria_admin,
    obtener_productos_slug_publico,
    listar_productos_publico,
    listar_productos_recomendados_publico,
    listar_productos_nuevos_publico,
    listar_productos_masvendidos_publico
    //obtener_reviews_producto_publico
}