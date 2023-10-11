import sha1 from 'sha1';
import DBClient from '../utils/db';

/**
 * Creates a new MongoDB instance.\
 * @class {UsersController} - Users controller class
 */
class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!password) return res.status(400).json({ error: 'Missing password' });

    const dbClient = DBClient;
    const userExist = await dbClient.getUser({ email });
    if (userExist) return res.status(400).json({ error: 'Already exist' });

    const hashedPassword = sha1(password);
    const user = await dbClient.createUser(email, hashedPassword);

    return res.status(201).json({ id: user.id, email: user.email });
  }

  static async getMe(req, res) {
    const token = req.header('X-Token');
    if (!token) return res.status(401).json({ error: 'Unauthorized', error2: 'Missing X-Token' });
    const dbClient = DBClient;
    const user = await dbClient.getUser({ id: token });
    if (!user) return res.status(401).json({ error: 'Unauthorized', error2: 'Invalid X-Token' });
    return res.status(200).json({ id: user.id, email: user.email });
  }
}

module.exports = UsersController;
