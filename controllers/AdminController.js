'use strict'
var Admin = require('../models/admin');
var bcrytp = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');
var Etiqueta = require('../models/Etiqueta');
var Producto = require('../models/Producto');
var Producto_etiqueta = require('../models/Producto_etiqueta');
var Carrito = require('../models/Carrito');
var fs = require('fs');
var path = require('path');

//Registro Admin
const registro_admin = async function(req, res) {
    //
    //REGISTRO:
    var data = req.body;
    var admin_arr = [];
    admin_arr = await Admin.find({ email: data.email })

    //Validar mail si existe
    if (admin_arr.length == 0) {
        //valida y encripta contraseña usando bcrypt
        if (data.password) {
            //encripta contraseña
            bcrytp.hash(data.password, null, null, async function(err, hash) {

                if (hash) { //si la contraseña esta encriptada
                    console.log(hash)
                    data.password = hash; //nuevo laor de la contraseña encriptada
                    var reg = await Admin.create(data); // Crea usuario
                    res.status(200).send({ data: reg }); //registra usuario
                } else {
                    res.status(200).send({ message: "Error Server", data: undefined });
                }

            });
        } else {
            res.status(200).send({ message: "No hay una contraseña", data: undefined });

        }

    } else {
        res.status(200).send({ message: "el correo ya existe en la base de datos", data: undefined });
    }



}

//Login Admin
const login_admin = async function(req, res) {
    var data = req.body;
    //Verifica si el coreo existe en la BD
    var admin_arr = []

    admin_arr = await Admin.find({ email: data.email }) //busca el mail del admin y lo encierrra en el array

    if (admin_arr.length == 0) { //si el array esta vacio no hay usuario registrado con el mail buscado
        res.status(200).send({ message: 'No se encontro el email \n"mensaje desde el backend"', data: undefined })
    } else {
        //LOGIN
        let user = admin_arr[0];
        //Desencripta y verifica si la contraseña coincide con la BD
        bcrytp.compare(data.password, user.password, async function(error, check) {
            if (check) {
                // console.log(user)
                res.status(200).send({
                    data: user,
                    token: jwt.createToken(user)
                });
            } else {
                res.status(200).send({ message: 'La contraseña no coincide \n"mensaje desde el backend"', data: undefined });
            }
        });
    }
}


const listar_etiquetas_admin = async function(req, res) {
    if (req.user) {
        var reg = await Etiqueta.find();
        res.status(200).send({ data: reg });
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const eliminar_etiqueta_admin = async function(req, res) {
    if (req.user) {
        var id = req.params['id'];

        let reg = await Etiqueta.findByIdAndRemove({ _id: id });
        res.status(200).send({ data: reg });
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const agregar_etiqueta_admin = async function(req, res) {
    if (req.user) {
        try {
            let data = req.body;

            data.slug = data.titulo.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');;
            var reg = await Etiqueta.create(data);
            res.status(200).send({ data: reg });
        } catch (error) {
            res.status(200).send({ data: undefined, message: 'Etiqueta ya existente' });

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

const listar_etiquetas_producto_admin = async function(req, res) {
    if (req.user) {
        var id = req.params['id'];
        var etiquetas = await Producto_etiqueta.find({ producto: id }).populate('etiqueta');
        res.status(200).send({ data: etiquetas });
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const eliminar_etiqueta_producto_admin = async function(req, res) {
    if (req.user) {
        var id = req.params['id'];
        console.log(id);
        let reg = await Producto_etiqueta.findByIdAndRemove({ _id: id });
        res.status(200).send({ data: reg });

    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const agregar_etiqueta_producto_admin = async function(req, res) {
    if (req.user) {
        let data = req.body;

        var reg = await Producto_etiqueta.create(data);
        res.status(200).send({ data: reg });
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const obtener_portada = async function(req, res) {
    var img = req.params['img'];


    fs.stat('./uploads/productos/' + img, function(err) {
        if (!err) {
            let path_img = './uploads/productos/' + img;
            res.status(200).sendFile(path.resolve(path_img));
        } else {
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        }
    })
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

const listar_variedades_admin = async function(req, res) {
    if (req.user) {
        var id = req.params['id'];
        let data = await Variedad.find({ producto: id });
        res.status(200).send({ data: data });

    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const actualizar_producto_variedades_admin = async function(req, res) {
    if (req.user) {
        let id = req.params['id'];
        let data = req.body;

        console.log(data.titulo_variedad);
        let reg = await Producto.findByIdAndUpdate({ _id: id }, {
            titulo_variedad: data.titulo_variedad,
        });
        res.status(200).send({ data: reg });
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const eliminar_variedad_admin = async function(req, res) {
    if (req.user) {
        var id = req.params['id'];

        let reg = await Variedad.findByIdAndRemove({ _id: id });
        res.status(200).send({ data: reg });

    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const agregar_nueva_variedad_admin = async function(req, res) {
    if (req.user) {
        var data = req.body;

        console.log(data);
        let reg = await Variedad.create(data);

        res.status(200).send({ data: reg });

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


module.exports = {
    registro_admin,
    login_admin,
    listar_productos_admin,
    listar_variedades_productos_admin,
    obtener_producto_admin,
    listar_etiquetas_producto_admin,
    eliminar_etiqueta_producto_admin,
    agregar_etiqueta_producto_admin,
    obtener_portada,
    actualizar_producto_admin,
    listar_variedades_admin,
    actualizar_producto_variedades_admin,
    eliminar_variedad_admin,
    eliminar_producto_admin,
    agregar_nueva_variedad_admin,
    listar_etiquetas_admin,
    eliminar_etiqueta_admin,
    agregar_etiqueta_admin,
    registro_producto_admin
}