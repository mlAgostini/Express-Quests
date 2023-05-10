const database = require("./database");

const getUsers = (req, res) => {
    database
        .query("SELECT * FROM users")
        .then(([users]) => {
            res.json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error retrieving data users from database");
        })
}

const getUserById = (req, res) => {
    const id = parseInt(req.params.id);

    database
        .query("SELECT * FROM users WHERE ID = ?", [id])
        .then(([users]) => {
            if (users[0] != null) {
                res.json(users[0]);
            } else {
                res.status(404).send("Not Found");
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error retrieving data user from database");
        })
}

const postUser = (req, res) => {
    const { firstname, lastname, email, city, language } = req.body;
    res.send("Post route is working, nice !");

    database
        .query(
            "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
            [firstname, lastname, email, city, language]
        )
        .then(([result]) => {
            res.location(`/api/users/${result.insertId}`).sendStatus(201);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error saving the user");
        });
};

const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { firstname, lastname, email, city, language } = req.body;

    database
        .query(
            "UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language = ?, WHERE id = ?",
            [ firstname, lastname, email, city, language, id]
        )
        .then(([result]) => {
            if (result.affectedRows === 0) {
                res.status(404).send("Not Found");
            } else {
                res.sendStatus(204);
            }
        })
        .catch((err) =>{
            console.error(err);
            res.status(500).send("Error editing the user");
        });
};

module.exports = {
    getUsers,
    getUserById,
    postUser,
    updateUser,
};