import { connection } from "../database/db.js";
import { gameSchema } from "../models/gameSchema.js";

export async function gameValidation(req, res, next) {
	const gameInfo = req.body;

	if (!gameInfo) {
		return res.sendStatus(400);
	}

	const validationErrors = gameSchema.validate(gameInfo, {
		abortEarly: false,
	}).error;

	if (validationErrors) {
		const errors = validationErrors.details.map((e) => e.message);
		return res.status(400).send(errors);
	}

    try {
        const gameArr = await connection.query(`
            SELECT
                *
            FROM
                games
        `)

        const gameNames = gameArr.rows.map((g) => (g.name))

        if (gameNames.includes(gameInfo.name)) {
            return res.status(409).send('Game already registered.')
        }
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }

	res.locals.gameInfo = gameInfo;
	next();
}
