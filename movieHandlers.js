const database = require("./database");

// METHOD GET MOVIES
const getMovies = (req, res) => {
  let sql = "SELECT * FROM movies";
  const sqlValues = [];

  // Filtres via query.string
  if (req.query.color != null) {
    sql += " WHERE color = ? ";
    sqlValues.push(req.query.color);
  }

  if (req.query.max_duration != null) {
    sql += " AND duration <= ? ";
    sqlValues.push(req.query.max_duration);
  }
  else if (req.query.max_duration != null) {
    sql += " WHERE duration <= ? ";
    sqlValues.push(req.query.max_duration);
  }

  database
    .query(sql, sqlValues)

    .then(([movies]) => {
      console.log(sql);
      res.json(movies);
      
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data movies from database");
    });
};

// METHOD GET MOVIE BY ID
const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("SELECT * FROM movies WHERE ID = ?", [id])
    .then(([movies]) => {
      if (movies[0] != null) {
        res.json(movies[0]);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data movie from database");
    });
};

// METHOD POST MOVIE
const postMovie = (req, res) => {
  const { title, director, year, color, duration } = req.body;
  res.send("Post route is working, yeah 🎉");

  database
    .query(
      "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
      [title, director, year, color, duration]
    )
    .then(([result]) => {
      res.location(`/api/movies/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the movie");
    });
};

// METHOD PUT MOVIE
const updateMovie = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, director, year, color, duration } = req.body;

  database
    .query(
      "UPDATE movies SET title = ?, director = ?, year = ?, color =?, duration = ? where id = ?",
      [title, director, year, color, duration, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.status(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error editing the movie");
    });
};

// METHOD DELETE MOVIE
const deleteMovie = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query(
      "DELETE FROM movies WHERE id = ?", [id]
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
      res.status(500).send("Error deleting the movie");
    });
}

module.exports = {
  getMovies,
  getMovieById,
  postMovie,
  updateMovie,
  deleteMovie,
};
