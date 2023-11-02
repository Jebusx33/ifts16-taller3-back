var cupon = require('../models/cupon');
const registro_cupon_admin = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){
            let data = req.body;
            let reg = await cupon.create(data);
            res.status(200).send({data:reg});

        }else {
            res.status(500).send({
                message: "Error en el servidor",
                data: undefined
            });
        }
    }else {
        res.status(500).send({
            message: "Error en el servidor",
            data: undefined
        });
    }

}

module.exports = {
    registro_cupon_admin
}