const Loan = require("../models/loan.model").Loan;
const User = require("../models/user.model").User;
const Objeto = require("../models/object.model").Objeto;

// Open a Loan
async function loanObject(req, res) {
    const { userId, objectId, returnDate } = req.body;

    if (!userId || !objectId || !returnDate) {
        console.log("Faltan datos necesarios en la solicitud:", req.body);
        return res.status(400).json({ mensaje: "Faltan datos necesarios" });
    }

    try {
        // Fetch the object using the object ID
        const objeto = await Objeto.findById(objectId);
        console.log("Objeto encontrado:", objeto);  // Log the object fetched

        if (!objeto) {
            console.log("Objeto no encontrado con el ID proporcionado:", objectId);
            return res.status(404).json({ mensaje: "Objeto no encontrado" });
        }

        if (objeto.estado !== 'Disponible') {
            console.log("El objeto no está disponible para préstamo. Estado actual:", objeto.estado);
            return res.status(400).json({ mensaje: "El objeto no está disponible para préstamo" });
        }

        // Fetch the user using the user ID
        const user = await User.findById(userId);
        console.log("Usuario encontrado:", user);  // Log the user fetched

        if (!user) {
            console.log("Usuario no encontrado con el ID proporcionado:", userId);
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        // Create a new loan
        const newLoan = new Loan({
            nameUser: userId,
            nameObj: objectId,
            returnDate: returnDate // Date format: YYYY-MM-DD
        });

        await newLoan.save();
        console.log("Préstamo creado:", newLoan);  // Log the loan created

        // Update the object's status and loanId
        objeto.estado = 'En uso';
        objeto.loanId = newLoan._id;
        await objeto.save();

        console.log("Objeto actualizado a 'En uso' con el ID del préstamo:", objeto);  // Log object update

        res.json({ mensaje: "Préstamo creado exitosamente", loan: newLoan });
    } catch (err) {
        console.error("Error al crear el préstamo:", err);
        res.status(500).json({ mensaje: "Hubo un error al crear el préstamo" });
    }
}

// Close a Loan
async function returnObject(req, res) {
    const { loanId, observaciones } = req.body;

    if (!loanId) {
        return res.status(400).json({ mensaje: "ID del préstamo es requerido" });
    }

    try {
        // Fetch the loan by its ID
        const loan = await Loan.findById(loanId);
        if (!loan) {
            return res.status(404).json({ mensaje: "Préstamo no encontrado" });
        }

        if (!loan.status) {
            return res.status(400).json({ mensaje: "El préstamo ya ha sido devuelto" });
        }

        // Update loan status and add actual return date
        loan.status = false;
        loan.actualReturnDate = Date.now();
        loan.observaciones = observaciones || 'Sin observaciones';
        await loan.save();

        // Find the object associated with the loan and update its status
        const objeto = await Objeto.findById(loan.nameObj);
        objeto.estado = 'Disponible';
        objeto.loanId = null;
        await objeto.save();

        res.json({ mensaje: "Préstamo devuelto correctamente", loan });
    } catch (err) {
        console.error("Error al devolver el préstamo:", err);
        res.status(500).json({ mensaje: "Hubo un error al devolver el préstamo" });
    }
}

// Get Loan by Object ID
async function getLoanByObjectId(req, res) {
    const { id } = req.query;

    try {
        const loans = await Loan.find({ nameObj: id });

        if (loans.length === 0) {
            return res.status(404).json({ mensaje: "No se encontraron préstamos para este objeto" });
        }

        res.json(loans);
    } catch (err) {
        console.log(err);
        res.status(500).json({ mensaje: "Hubo un error al buscar los préstamos" });
    }
}

// Read Loan (Get Loan by Loan ID)
async function loanReadObject(req, res) {
    const { loanId } = req.body;

    try {
        const readLoan = await Loan.findOne({ _id: loanId })
            .populate('nameUser', 'name surName')
            .populate('nameObj', 'nombre');

        if (!readLoan) {
            return res.status(404).json({ mensaje: "No se encontró el préstamo con el ID proporcionado" });
        }

        res.json({ loan: readLoan });
    } catch (err) {
        console.log(err);
        res.status(500).json({ mensaje: "Hubo un error al buscar el préstamo" });
    }
}

// Update Loan Object
async function loanUpdateObject(req, res) {
    const { loanId, userId, objectId, returnDate, observaciones } = req.body;

    try {
        const updatedLoan = await Loan.findByIdAndUpdate(
            loanId,
            {
                nameUser: userId,
                nameObj: objectId,
                returnDate: returnDate, // Expected return date
                observaciones: observaciones || 'Sin observaciones'
            },
            { new: true }
        );

        if (!updatedLoan) {
            return res.status(404).json({ mensaje: "No se encontró el préstamo con el ID proporcionado" });
        }

        res.json({ loan: updatedLoan });
    } catch (err) {
        console.log(err);
        res.status(500).json({ mensaje: "Hubo un error al actualizar el préstamo" });
    }
}

// Delete Loan Object
async function loanDeleteObject(req, res) {
    const { loanId } = req.body;

    try {
        const loan = await Loan.findByIdAndDelete(loanId);

        if (!loan) {
            return res.status(404).json({ mensaje: "No se encontró el préstamo con el ID proporcionado" });
        }

        res.json({ mensaje: "Préstamo eliminado correctamente" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ mensaje: "Hubo un error al eliminar el préstamo" });
    }
}

// Get All Loans
async function getAllLoans(req, res) {
    try {
        const loans = await Loan.find({});

        if (!loans) {
            return res.status(404).json({ mensaje: "No se encontraron préstamos" });
        }

        res.json({ loans });
    } catch (err) {
        console.log(err);
        res.status(500).json({ mensaje: "Hubo un error al obtener los préstamos" });
    }
}

module.exports = {
    loanObject,
    loanDeleteObject,
    loanReadObject,
    loanUpdateObject,
    getAllLoans,
    returnObject,
    getLoanByObjectId
};
