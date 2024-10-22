
const Ceiit = require("../models/object.model.js").Ceiit;
const Loan = require("../models/loan.model.js").Loan;

async function searchObj(req, res) {
    const id = req.query.id;
  
    console.log('Request Query:', req.query); // Verificar los parámetros de la consulta
  
    if (!id) {
      return res.status(400).send({ error: 'Se requiere un _id para la búsqueda.' });
    }
  
    try {
      const search = await Ceiit.findById(id);
      if (!search) {
        return res.status(404).send({ error: 'Objeto no encontrado.' });
      }
      res.status(200).send(search);
    } catch (error) {
      res.status(500).send(error);
      console.log(error);
    }
  }

async function searchLoan(req,res){
    const matricula = req.body.tuiti;
    const queryLoan = {};

    if(matricula){
        queryLoan.tuition = matricula;
    }
    try {
        const searchLoan = await Loan.find(queryLoan);
        res.status(200).send(searchLoan);
    } catch (error) {
        res.status(500).send(error);
    }

}
async function changeStatus(req,res){
    const qr = req.body.qr;

    if (!qr) {
        return res.status(400).send({ mensaje: "¡Se requiere el código QR!" });
    }

    try {
        // Encuentra el objeto por su código QR
        const objeto = await Object.findOne({ qr: qr });

        if (!objeto) {
            return res.status(404).send({ mensaje: "¡Objeto no encontrado!" });
        }

        // Cambia el estatus
        objeto.status = !objeto.status;

        // Guarda el objeto actualizado
        await objeto.save();

        res.status(200).send(objeto);
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = {
    searchObj, searchLoan,changeStatus
};


