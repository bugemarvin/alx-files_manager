import { MongoClient } from 'mongodb';

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
        console.log('MongoDB connected');
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
    return this.client && this.client.isConnected();
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
   * Gets a users email address from MongoDB
   * @instance DBClient
   * @async - Async function
   * @param {string} query - MongoDB query
   * @returns {object} MongoDB user
   * @function getUser - Gets a users email address from MongoDB
   */
  async getUser(query) {
    if (this.DB_URL) {
      return this.DB_URL.collection('users').findOne(query);
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
