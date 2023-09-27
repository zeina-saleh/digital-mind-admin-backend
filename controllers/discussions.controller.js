const connection = require('../configs/db.connection')

const getAllDiscussions = async (req, res) => {
    connection.query("SELECT id, title, created_at FROM DISCUSSIONS", (err, result) => {
      if (err) console.log(err)
  
      res.send(result)
    });
  }

  const deleteDiscussion= (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM discussions WHERE id = ?`;
    connection.query(sql, [id], (err, result) => {
      if (err) {
        console.error('Error deleting discussion:', err);
        res.status(500).json({ error: 'An error occurred while deleting the discussion.' });
      } else {
        if (result.affectedRows > 0) {
          res.status(200).json({ message: 'Discussion deleted successfully.', deletedDiscussionId: id });
        } else {
          res.status(404).json({ error: 'Discussion not found.' });
        }
      }
    });
  };

  module.exports = { getAllDiscussions, deleteDiscussion }