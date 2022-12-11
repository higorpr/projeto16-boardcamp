import { connection } from "../database/db.js";

export async function getGames(req, res) {
	let games;
	let { name } = req.query;
	let gamesResponse;

	try {
        const nameLowered = (name) ? name.toLowerCase() : '';
			gamesResponse = await connection.query(
				`
            SELECT
                games.id, 
                games.name, 
                games.image, 
                games."stockTotal", 
                games."categoryId",
                games."pricePerDay",
                categories.name AS "categoryName"
            FROM
                games
            JOIN
                categories
            ON
                games."categoryId" = categories.id
            WHERE
                LOWER (games.name)
            LIKE
                $1||'%'
        `,
				[nameLowered]
			);

		games = gamesResponse.rows;

	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}

	res.status(200).send(games);
}

export function postGame(req, res) {
    

}
