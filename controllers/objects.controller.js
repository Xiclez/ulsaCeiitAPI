const Ceiit = require("../models/ceiit.models").Ceiit;
const { logAction } = require("../controllers/log.controller");

async function addObject(req, res) {
    const { ob, ubi, esta, imgURL } = req.body;

    if (!req.user || !req.user.username) {
        return res.status(401).send('User not authenticated');
    }

    const user = req.user.username;

    try {
        const newObject = await new Ceiit({
            NOMBRE: ob,
            Lugar: ubi,
            isAvailable: esta,
            imgURL: imgURL
        }).save();

        const logData = {
            user: user,
            action: 'add',
            element: `object:${newObject._id}:${ob}`,
            date: new Date()
        };

        await logAction(logData);

        res.json({ obj: newObject });
    } catch (err) {
        console.log(err);
        res.status(500).send('Error al agregar objeto');
    }
}

async function getAllObjects(req, res) {
    const user = req.user.username;

    try {
        const objects = await Ceiit.find();
        res.json({ objs: objects });
    } catch (err) {
        console.log(err);
        res.status(500).json({ mensaje: "Hubo un error al obtener los objetos" });
    }
}

async function updateObject(req, res) {
    const { id, ubi } = req.body;

    if (!req.user || !req.user.username) {
        return res.status(401).send('User not authenticated');
    }

    const user = req.user.username;

    try {
        const updateOb = await Ceiit.findByIdAndUpdate(id, { Lugar: ubi }, { new: true });

        if (!updateOb) {
            return res.status(404).json({ mensaje: "No se encontró el objeto" });
        }

        await logAction({
            user: user,
            action: 'update',
            element: `object:${updateOb._id}:${updateOb.NOMBRE}`,
            date: new Date()
        });

        res.json({ obj: updateOb });
    } catch (err) {
        console.log(err);
        res.status(500).json({ mensaje: "Hubo un error al actualizar el objeto" });
    }
}

async function deleteObject(req, res) {
    const { id } = req.body;

    if (!req.user || !req.user.username) {
        return res.status(401).send('User not authenticated');
    }

    const user = req.user.username;

    try {
        const deleteO = await Ceiit.findByIdAndDelete(id);

        if (!deleteO) {
            res.status(401).json({ mensaje: "No se encontró el objeto" });
            return;
        }

        await logAction({
            user: user,
            action: 'delete',
            element: `object:${deleteO._id}:${deleteO.NOMBRE}`,
            date: new Date()
        });

        res.json({ obj: deleteO });
    } catch (err) {
        console.log(err);
        res.status(500).json({ mensaje: "Hubo un error al borrar el objeto" });
    }
}

async function readObject(req, res) {
    const { id } = req.body;

    if (!req.user || !req.user.username) {
        return res.status(401).send('User not authenticated');
    }

    const user = req.user.username;

    try {
        const object = await Ceiit.findById(id);

        if (!object) {
            res.status(401).json({ mensaje: "No se encontró el objeto" });
            return;
        }

        await logAction({
            user: user,
            action: 'read',
            element: `object:${object._id}:${object.NOMBRE}`,
            date: new Date()
        });

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
    getAllObjects
};
