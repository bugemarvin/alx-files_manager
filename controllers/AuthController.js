import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import DBClient from '../utils/db';
import RedisClient from '../utils/redis';

class AuthController {
  static async getConnect(req, res) {
    try {
      const auth = req.header('Authorization');
      const buff = Buffer.from(auth.replace('Basic ', ''), 'base64').toString('utf-8');
      const [email, password] = buff.split(':');
      const hashedpassword = sha1(password);
      const user = await DBClient.getUser({ email, password: hashedpassword });
      if (!user) {
        return res.status(401).send({ error: 'Unauthorized' });
      }
      const tokens = uuidv4();
      const key = `auth_${tokens}`;
      await RedisClient.set(key, user.id, 86400);
      return res.status(200).send({ token: tokens });
    } catch (err) {
      return res.status(500).send({ error: err.message });
    }
  }
}

export default AuthController;
