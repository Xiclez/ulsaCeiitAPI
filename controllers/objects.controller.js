const Objeto = require("../models/object.model").Objeto; // Correct the import

async function addObject(req, res) {
    const { ob, ubi, esta, imgURL } = req.body;

    try {
        const newObject = await new Objeto({ // Use Objeto here
            NOMBRE: ob,
            Lugar: ubi,
            isAvailable: esta,
            imgURL: imgURL
        }).save();

        res.json({ obj: newObject });
    } catch (err) {
        console.log(err);
        res.status(500).send('Error al agregar objeto');
    }
}

async function getAllObjects(req, res) {
    try {
        const objects = await Objeto.find(); // Use Objeto here
        res.json({ objs: objects });
    } catch (err) {
        console.log(err);
        res.status(500).json({ mensaje: "Hubo un error al obtener los objetos" });
    }
}

async function updateObject(req, res) {
    const { id, ubi } = req.body;

    try {
        const updateOb = await Objeto.findByIdAndUpdate(id, { Lugar: ubi }, { new: true }); // Use Objeto here

        if (!updateOb) {
            return res.status(404).json({ mensaje: "No se encontró el objeto" });
        }

        res.json({ obj: updateOb });
    } catch (err) {
        console.log(err);
        res.status(500).json({ mensaje: "Hubo un error al actualizar el objeto" });
    }
}

async function deleteObject(req, res) {
    const { id } = req.body;

    try {
        const deleteO = await Objeto.findByIdAndDelete(id); // Use Objeto here

        if (!deleteO) {
            res.status(404).json({ mensaje: "No se encontró el objeto" });
            return;
        }

        res.json({ obj: deleteO });
    } catch (err) {
        console.log(err);
        res.status(500).json({ mensaje: "Hubo un error al borrar el objeto" });
    }
}

async function readObject(req, res) {
    const { id } = req.body;

    try {
        const object = await Objeto.findById(id); // Use Objeto here

        if (!object) {
            res.status(404).json({ mensaje: "No se encontró el objeto" });
            return;
        }

        res.json({ obj: object });
    } catch (err) {
        console.log(err);
        res.status(500).json({ mensaje: "Hubo un error al buscar el objeto" });
    }
}

async function getObjectQR(req, res) {
    const { codigoQR } = req.query;

    try {
        const object = await Objeto.findOne({ codigoQR: codigoQR }); 

        if (!object) {
            return res.status(404).json({ mensaje: "No se encontró el objeto con el código QR proporcionado" });
        }

        res.json({ obj: object });
    } catch (err) {
        console.log(err);
        res.status(500).json({ mensaje: "Hubo un error al buscar el objeto" });
    }
}

module.exports = {
    addObject,
    readObject,
    deleteObject,
    updateObject,
    getAllObjects,
    getObjectQR
};
