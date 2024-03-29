import { MongoClient, ObjectId } from 'mongodb';

/**
 * Creates a new MongoDB instance.
 * @class {DBClient}  - MongoDB class
 */
class DBClient {
  /**
   * Creates a new MongoDB instance.
   * @constructor MongoDB
   * @param {string} DB_HOST - MongoDB host
   * @param {number} DB_PORT - MongoDB port
   * @param {string} DB_DATABASE - MongoDB database
   * @param {string} url - MongoDB url
   * @param {object} client - MongoDB client
   * @param {object} DB_URL - MongoDB database url
   * @memberof DBClient
   */
  constructor() {
    this.DB_HOST = process.env.DB_HOST || 'localhost';
    this.DB_PORT = process.env.DB_PORT || 27017;
    this.DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
    this.url = `mongodb://${this.DB_HOST}:${this.DB_PORT}`;
    this.client = new MongoClient(this.url, { useUnifiedTopology: true });

    this.client.connect()
      .then(() => {
        this.DB_URL = this.client.db(this.DB_DATABASE);
      })
      .catch((err) => {
        console.log('MongoDB connection error', err);
      });
  }

  /**
   * Checks if MongoDB client is alive
   * @returns {boolean} true if client is alive, false otherwise
   * @memberof DBClient
   * @method isAlive  - Checks if MongoDB client is alive
   * @instance DBClient
   */
  isAlive() {
    if (!this.client) {
      return false;
    }
    return true;
  }

  /**
   * Gets a value count of users from MongoDB
   * @instance DBClient
   * @async - Async function
   * @param {number} nbUsers - Number of users
   */
  async nbUsers() {
    if (this.DB_URL) {
      return this.DB_URL.collection('users').countDocuments();
    }
    return 0;
  }

  /**
   * Gets a values count of files from MongoDB
   * @instance DBClient
   * @async - Async function
   * @param {number} nbFiles - Number of files
   */
  async nbFiles() {
    if (this.DB_URL) {
      return this.DB_URL.collection('files').countDocuments();
    }
    return 0;
  }

  /**
   * Gets a users details or by id too from MongoDB
   * @function getUser - Gets a users details or by id too from MongoDB
   * @instance DBClient
   * @async - Async function
   * @param {object} user - Users object
   * @param {object} user._id - Users id from MongoDB
   * @returns {object} MongoDB user details
   */
  async getUser(user) {
    if (this.DB_URL) {
      const info = await this.DB_URL.collection('users');
      try {
        if (user._id) {
          const result = await info.findOne({ _id: new ObjectId(user._id) });
          return result;
        }
        const result = await info.findOne(user);
        return result;
      } catch (err) {
        return err;
      }
    }
    return 0;
  }

  /**
   * Creates a new user in MongoDB
   * @instance DBClient
   * @async - Async function
   * @param {string} email - Users email address
   * @param {string} password - Users password
   * @returns {object} MongoDB user
   * @function createUser - Creates a new user in MongoDB
   */
  async createUser(email, password) {
    if (this.DB_URL) {
      const user = { email, password };
      const result = await this.DB_URL.collection('users').insertOne(user);
      user.id = result.insertedId;
      return user;
    }
    return null;
  }
}

export default new DBClient();
