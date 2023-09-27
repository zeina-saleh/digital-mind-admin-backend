const connection = require("../configs/db.connection")


const getTotals = async (req, res) => {
    connection.query(
        "SELECT COUNT(*) FROM users; SELECT COUNT(*) FROM collections;SELECT COUNT(*) FROM discussions;SELECT COUNT(*) FROM files", 
    (err, result) => {
        if (err) console.log(err)
      });
}

module.exports = { getTotals }