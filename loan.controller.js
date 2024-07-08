const Loan = require("../models/loan.models.js").Loan;

async function loanObject(req, res){
    const id = req.body.id;
	const tuit = req.body.tuiti;
	const nameObj = req.body.no;
    const da = req.body.dat;
    const numS = req.body.ns;
    const canti = req.body.cant;

	try {
		const newLoan = await new Loan({
            id:id,
			tuition:tuit,
			nameObject: nameObj,
            date : da,
            numSerial: numS,
            cantidad : canti
		}).save();

		res.json({
			obj: newLoan


		})
	} catch (err) {
		console.log(err);
	}
}
//PENDIENTE
// async function updateObject(req,res){
// 	const object = req.body.ob;
// 	const numberS = req.body.num;
//     const ubica = req.body.ubi;
//     const descrip = req.body.des;
//     const canti = req.body.cant;
    
// 	try{
// 		const updateOb = await Object.updateOne({
// 			name:object
		
// 		},{
// 			$set : {
				
// 			}
// 		});
//         if(!updateOb){
// 			res.status(401).json({mensaje: "No se encontro el objecto"})
// 		}
// 		res.json({
// 			obj : updateOb
// 		})
// 	}catch(err){
// 		console.log(err)
// 		res.status(500).json({mensaje : "Hubo un error al buscar el objecto"})
// 	}
// }
async function loanDeleteObject(req,res){
	const id = req.body.id;
	try{
		const loan = await Loan.deleteOne({
			id:id
		});
        if(!loan){
			res.status(401).json({mensaje: "No se encontro el prestamo"})
		}
		res.json({
			obj : loan
		})
	}catch(err){
		console.log(err)
		res.status(500).json({mensaje : "Hubo un error al borrar el prestamo"})
	}
}
async function loanReadObject(req,res){
	const id = req.body.id;

    
	try{
		const readLoan = await Loan.findOne({
			id:id
		
		});
        if(!readLoan){
			res.status(401).json({mensaje: "No se encontro el prestamo"})
		}
		res.json({
			obj : readLoan
		})
	}catch(err){
		console.log(err)
		res.status(500).json({mensaje : "Hubo un error al buscar el prestamo"})
	}
}

module.exports = {
	loanObject, loanDeleteObject,loanReadObject
};