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

    const dbClient = new DBClient();
    const userExist = await dbClient.getUser({ email });
    if (userExist) return res.status(400).json({ error: 'Already exist' });

    const hashedPassword = sha1(password);
    const user = await dbClient.createUser(email, hashedPassword);

    return res.status(201).json({ id: user.id, email: user.email });
  }
}

export default UsersController;
