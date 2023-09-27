const connection = require("../configs/db.connection")
const bcrypt = require("bcrypt")

const getAllUsers = async (req, res) => {
  connection.query("SELECT id, name, email FROM USERS  WHERE email <> 'charbel@gmail.com'", (err, result) => {
    if (err) console.log(err)

    res.send(result)
  });
}

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const emailExists = await new Promise((resolve, reject) => {
      connection.query('SELECT * FROM USERS WHERE email = ?', [email], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.length > 0);
        }
      });
    });
    if (emailExists) {
      return res.status(409).send({ message: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    connection.query(
      'INSERT INTO USERS (name, email, password ) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ message: 'Failed to register user' });
        }
        else return res.send(result[0])
      })
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Something went wrong' });
  }
}

const updateUser = async (req, res) => {
  const { name, email, password } = req.body;
  const { id } = req.params;
  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
  const updateFields = [];
  const queryParams = [];
  if (name) {
    updateFields.push('name = ?');
    queryParams.push(name);
  }
  if (email) {
    updateFields.push('email = ?');
    queryParams.push(email);
  }
  if (hashedPassword) {
    updateFields.push('password = ?');
    queryParams.push(hashedPassword);
  }
  if (updateFields.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }
  queryParams.push(id);
  const sql = `UPDATE USERS SET ${updateFields.join(', ')} WHERE id = ?`;
  connection.query(sql, queryParams, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update user' });
    }
    if (result.affectedRows > 0) {
      connection.query('SELECT * FROM USERS WHERE id = ?', [id], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to fetch updated user data' });
        }
        res.send(result[0]);
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });
}

const deleteUser = (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM users WHERE id = ?`;
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({ error: 'An error occurred while deleting the user.' });
    } else {
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'User deleted successfully.', deletedUserId: id });
      } else {
        res.status(404).json({ error: 'User not found.' });
      }
    }
  });
};


module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
}