const Loan = require("../models/loan.models").Loan;
const User = require("../models/user.models").User;
const Ceiit = require("../models/ceiit.models").Ceiit;
const { logAction } = require('../controllers/log.controller');

async function getLoanByObjectId(req, res) {
    const { id } = req.query;

    try {
        // Buscar todos los préstamos que coincidan con nameObj
        const loans = await Loan.find({ nameObj: id });

        // Registrar la acción independientemente del resultado
        await logAction({
            user: req.user ? req.user.username : 'anonymous',
            action: 'search',
            element: `loan:${id}`,
            date: new Date()
        });

        // Si no se encuentran préstamos, retornar un mensaje 404
        if (loans.length === 0) {
            return res.status(404).json({ mensaje: "Préstamos no encontrados" });
        }

        // Retornar los préstamos encontrados
        res.json(loans);
    } catch (err) {
        console.log(err);
        res.status(500).json({ mensaje: "Hubo un error al buscar los préstamos" });
    }
}

async function returnObject(req, res) {
    const { loanId, linkCloseLoan } = req.body;
    console.log("Request body:", req.body);

    try {
        const loan = await Loan.findById(loanId);
        console.log("Loan found:", loan);

        if (!loan) {
            await logAction({
                user: req.user ? req.user.username : 'anonymous',
                action: 'return',
                element: `loan:${loanId}`,
                date: new Date()
            });
            return res.status(404).json({ mensaje: "Préstamo no encontrado" });
        }

        if (!loan.status) {
            await logAction({
                user: req.user ? req.user.username : 'anonymous',
                action: 'return',
                element: `loan:${loan._id}`,
                date: new Date()
            });
            return res.status(400).json({ mensaje: "El préstamo ya ha sido devuelto" });
        }

        loan.status = false;
        loan.returnDate = Date.now();
        loan.linkCloseLoan = linkCloseLoan;
        await loan.save();
        console.log("Loan updated:", loan);

        const ceiitObject = await Ceiit.findById(loan.nameObj);
        console.log("Ceiit object found:", ceiitObject);

        ceiitObject.isAvailable = true;
        await ceiitObject.save();
        console.log("Ceiit object updated:", ceiitObject);

        await logAction({
            user: req.user ? req.user.username : 'anonymous',
            action: 'return',
            element: `loan:${loan._id}`,
            date: new Date()
        });

        res.json({ mensaje: "Préstamo devuelto correctamente", loan });
    } catch (err) {
        console.error("Error al devolver el préstamo:", err);
        res.status(500).json({ mensaje: "Hubo un error al devolver el préstamo" });
    }
}


async function loanObject(req, res) {
    const { userId, ceiitId, linkOpenLoan } = req.body;
    console.log("Request body:", req.body);

    if (!userId || !ceiitId || !linkOpenLoan) {
        return res.status(400).json({ mensaje: "Faltan datos necesarios" });
    }

    try {
        const ceiitObject = await Ceiit.findById(ceiitId);
        console.log("Ceiit object found:", ceiitObject);

        if (!ceiitObject || !ceiitObject.isAvailable) {
            return res.status(400).json({ mensaje: "El objeto no está disponible" });
        }

        const newLoan = new Loan({
            nameUser: userId,
            nameObj: ceiitId,
            date: Date.now(),
            linkOpenLoan: linkOpenLoan
        });

        await newLoan.save();
        console.log("New loan created:", newLoan);

        ceiitObject.isAvailable = false;
        await ceiitObject.save();
        console.log("Ceiit object updated to unavailable");

        await logAction({
            user: req.user ? req.user.username : 'anonymous',
            action: 'create',
            element: `loan:${newLoan._id}`,
            date: new Date()
        });

        res.json({
            obj: newLoan
        });
    } catch (err) {
        console.error("Error al crear el préstamo:", err);
        res.status(500).json({ mensaje: "Hubo un error al crear el préstamo" });
    }
}


async function loanUpdateObject(req, res) {
    const { loanId, userId, ceiitId, linkOpenLoan, linkCloseLoan } = req.body;

    try {
        const updatedLoan = await Loan.findByIdAndUpdate(
            loanId,
            {
                nameUser: userId,
                nameObj: ceiitId,
                date: Date.now(),
                status: false,
                linkOpenLoan,
                linkCloseLoan
            },
            { new: true }
        );

        if (!updatedLoan) {
            await logAction({
                user: req.user ? req.user.username : 'anonymous',
                action: 'update',
                element: `loan:${loanId}`,
                date: new Date()
            });
            return res.status(404).json({ mensaje: "No se encontró el préstamo con el ID proporcionado" });
        }

        const ceiitObject = await Ceiit.findById(ceiitId);
        ceiitObject.isAvailable = true;
        await ceiitObject.save();

        await logAction({
            user: req.user ? req.user.username : 'anonymous',
            action: 'update',
            element: `loan:${updatedLoan._id}`,
            date: new Date()
        });

        res.json({
            obj: updatedLoan
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ mensaje: "Hubo un error al actualizar el préstamo" });
    }
}

async function loanDeleteObject(req, res) {
    const { loanId } = req.body;

    try {
        const loan = await Loan.findByIdAndDelete(loanId);

        if (!loan) {
            await logAction({
                user: req.user ? req.user.username : 'anonymous',
                action: 'delete',
                element: `loan:${loanId}`,
                date: new Date()
            });
            return res.status(404).json({ mensaje: "No se encontró el préstamo con el ID proporcionado" });
        }

        const ceiitObject = await Ceiit.findById(loan.nameObj);
        if (ceiitObject) {
            ceiitObject.isAvailable = true;
            await ceiitObject.save();
        }

        await logAction({
            user: req.user ? req.user.username : 'anonymous',
            action: 'delete',
            element: `loan:${loan._id}`,
            date: new Date()
        });

        res.json({
            mensaje: "Préstamo eliminado correctamente"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ mensaje: "Hubo un error al borrar el préstamo" });
    }
}


async function loanReadObject(req, res) {
    const { loanId } = req.body;

    try {
        const readLoan = await Loan.findOne({
            _id: loanId
        }).populate('nameUser', 'name surName')
          .populate('nameObj', 'NOMBRE');

        if (!readLoan) {
            await logAction({
                user: req.user ? req.user.username : 'anonymous',
                action: 'read',
                element: `loan:${loanId}`,
                date: new Date()
            });
            return res.status(404).json({ mensaje: "No se encontró el préstamo con el ID proporcionado" });
        } else {
            await logAction({
                user: req.user ? req.user.username : 'anonymous',
                action: 'read',
                element: `loan:${readLoan._id}`,
                date: new Date()
            });
            res.json({
                obj: readLoan
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ mensaje: "Hubo un error al buscar el préstamo" });
    }
}

async function getAllLoans(req, res) {
    try {
        const loans = await Loan.find({});
        if (!loans) {
            return res.status(404).json({ mensaje: "No se encontraron préstamos" });
        } else {
            await logAction({
                user: req.user ? req.user.username : 'anonymous',
                action: 'read',
                element: 'all loans',
                date: new Date()
            });
            res.json({ obj: loans });
        }
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ mensaje: "Hubo un error al obtener los préstamos" });
    }
}

module.exports = {
    loanObject,
    loanUpdateObject,
    loanDeleteObject,
    loanReadObject,
    getAllLoans,
    getLoanByObjectId,
    returnObject
};
