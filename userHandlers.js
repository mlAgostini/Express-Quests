const database = require("./database");

// METHOD GET USERS
const getUsers = (req, res) => {
    let sql = "SELECT * FROM users";
    const sqlValues = [];

    // Filtre via query.string
    if (req.query.language != null) {
        sql += " WHERE language = ?";
        sqlValues.push(req.query.language);
    }
    if (req.query.city != null) {
        sql += " AND city = ? ";
        sqlValues.push(req.query.max_duration);
      }
    else if (req.query.city != null) {
        sql += " WHERE city = ?";
        sqlValues.push(req.query.city)
    }

    database
        .query(sql, sqlValues)
        .then(([users]) => {
            res.json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error retrieving data users from database");
        })
}

// METHOD GET USER BY ID
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

// METHOD POST USER
const postUser = (req, res) => {
    const { firstname, lastname, email, city, language, hashedPassword } = req.body;
    res.send("Post route is working, nice !");

    database
        .query(
            "INSERT INTO users(firstname, lastname, email, city, language, hashedPassword) VALUES (?, ?, ?, ?, ?, ?)",
            [firstname, lastname, email, city, language, hashedPassword]
        )
        .then(([result]) => {
            res.send(result);
            //res.send(`/api/users/${result.insertId}`);
        })
        .catch((err) => {
            console.error(err);
            res.status(500);
        });
};

// METHOD PUT USER
const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { firstname, lastname, email, city, language, hashedPassword } = req.body;

    database
        .query(
            "UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language = ?, hashedPassword = ?, WHERE id = ?",
            [firstname, lastname, email, city, language, hashedPassword, id]
        )
        .then(([result]) => {
            if (result.affectedRows === 0) {
                res.status(404).send("Not Found");
            } else {
                res.sendStatus(204);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error editing the user");
        });
};

// METHOD DELETE USER
const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);

    database
        .query(
            "DELETE FROM users WHERE id = ?", [id]
        )
        .then(([result]) => {
            if (result.affectedRows === 0) {
                res.status(404).send("Not Found");
            } else {
                res.sendStatus(204);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error deleting the user");
        });
}

module.exports = {
    getUsers,
    getUserById,
    postUser,
    updateUser,
    deleteUser,
};