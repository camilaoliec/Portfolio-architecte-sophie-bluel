const db = require('./../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = db.users;

exports.signup = async (req, res) => {
	if(!req.body.email || !req.body.password) {
		return res.status(400).send({
			message: "Must have email and password"
		});
	}
	try{
		//  Vérifiez si l'utilisateur existe déjà
		const existingUser = await Users.findOne({ where: { email: req.body.email } });
		if (existingUser) {
			return res.status(400).send({
				message: "Email already in use"
			});
		}

		// Hash du mot de passe
		const hash = await bcrypt.hash(req.body.password, 10)
		const user = {
			email: req.body.email,
			password: hash
		};
		// Création de l'utilisateur dans la base de données
		await Users.create(user)
		return res.status(201).json({message: 'User Created'})
	} catch (err){
		// Gestion des erreurs internes du serveur
		console.error(err); //log de l'erreur pour débogage
		return res.status(500).send({
			message: "Internal server error during signup"
		});
	}

}

exports.login = async (req, res) => {
	try {
		// Rechercher l'utilisateur par e-mail
		const user = await Users.findOne({where: {email: req.body.email}});
		if(user === null){
			return res.status(404).json({message: 'user not found'})
		}

		// Comparer le mot de passe fourni avec le hash stocké
		const valid = await bcrypt.compare(req.body.password, user.password)
		if (!valid){
			return res.status(401).json({ message: 'Invalid password' });
		}
		
		// Générer le token JWT et le retourner avec l'ID de l'utilisateur
		const token = jwt.sign(
			{userId : user.id},
			process.env.TOKEN_SECRET,
			{ expiresIn: '24h' }
		);
		
		// Retourner la réponse de succès avec l'ID de l'utilisateur
		return res.status(200).json({
		userId: user.id,
		token: token

		});
	} catch (err) {
		// Gestion des erreurs serveur internes 
		console. error(err);
		return res.status(500).json({
			message: "Internal server error during login"
		});
	}
}
