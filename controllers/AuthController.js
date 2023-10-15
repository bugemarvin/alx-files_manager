/* eslint-disable import/no-unresolved */
import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import DBClient from '../utils/db';
import RedisClient from '../utils/redis';

class AuthController {
  static async getConnect(req, res) {
    try {
      const { headers } = req;
      const auth = headers.authorization;

      if (!auth || !auth.startsWith('Basic ')) {
        return res.status(401).send({ error: 'Unauthorized' });
      }

      const authData = Buffer.from(auth.slice(6), 'base64').toString('base64');
      const [email, password] = authData.split(':');
      const hashedPassword = sha1(password);

      const user = await DBClient.getUser({ email, password: hashedPassword });

      if (!user) {
        return res.status(401).send({ error: 'Unauthorized' });
      }

      // getting a user id from the database
      if (user._id) {
        user.id = user._id;
        console.log(user.id);
      }

      const token = uuidv4().toString();
      const key = `auth_${token}`;
      console.log(key);

      RedisClient.set(key, user.id, 86400);

      return res.status(200).send({ token });
    } catch (err) {
      return res.status(500).send({ error: err.message });
    }
  }

  /**
   * sign-out the user based on the token
   */
  static async getDisconnect(req, res) {
    const token = req.header('X-Token');
    const key = `auth_${token}`;
    if (!token) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    const userId = await RedisClient.get(key);
    if (!userId) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    RedisClient.del(key);
    return res.status(204).send({ message: 'Disconnect' });
  }
}

export default AuthController;
