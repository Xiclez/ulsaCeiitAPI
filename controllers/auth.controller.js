const jwt = require('jsonwebtoken');
const { config } = require('../config/config');

async function firmaJwt(req, res) {
    const { username } = req.body; 
    try {
        const nuevoToken = await jwt.sign(
            { username: username },
            config.auth.secretKey,
            { algorithm: 'HS256', expiresIn: '1h' }
        );

        res.status(200).json({
            message: "Token creado",
            jwt: nuevoToken
        });
    } catch (err) {
        console.error("Error al crear el token jwt:", err);
        res.status(500).json({
            message: "Error al crear el token jwt"
        });
    }
}

async function verifyJwt(req, res) {
    const headerToken = req.headers.authorization;

    console.log("Authorization header:", headerToken); // Log authorization header

    if (headerToken) {
        const tokenParts = headerToken.split(' ');
        if (tokenParts.length === 2 && tokenParts[0] === "Bearer") {
            const authToken = tokenParts[1];
            try {
                const decoded = await jwt.verify(authToken, config.auth.secretKey);
                console.log("Decoded token:", decoded); // Log decoded token
                return res.status(200).json({ message: "Token válido", user: decoded });
            } catch (err) {
                console.error("Token inválido:", err);
                return res.status(401).json({ message: "Token inválido" });
            }
        } else {
            return res.status(401).json({ message: "Formato de token incorrecto" });
        }
    } else {
        return res.status(401).json({ message: "Usuario no autentificado" });
    }
}

module.exports = {
    firmaJwt,
    verifyJwt
};
