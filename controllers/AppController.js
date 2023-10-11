import RedisClient from '../utils/redis';
import DBClient from '../utils/db';

class AppController {
  static getHomepage(req, res) {
    return res.status(200).json('Welcome to the API');
  }

  static getStatus(req, res) {
    const redisValue = RedisClient.isAlive();
    const dbValue = DBClient.isAlive();

    return res.status(200).json({ redis: redisValue, db: dbValue });
  }

  static async getStats(req, res) {
    const users = await DBClient.nbUsers();
    const files = await DBClient.nbFiles();

    return res.status(200).json({ users, files });
  }
}

export default AppController;
