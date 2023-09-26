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
    this.client.connect();
    this.DB_URL = this.client.db(this.DB_DATABASE) || this.client.db(process.env.DB_DATABASE);
  }

  /**
   * Checks if MongoDB client is alive
   * @returns {boolean} true if client is alive, false otherwise
   * @memberof DBClient
   * @method isAlive  - Checks if MongoDB client is alive
   * @instance DBClient
   */
  isAlive() {
    if (this.client === true) {
      return true;
    }
    return false;
  }

  /**
   * Gets a value count of users from MongoDB
   * @instance DBClient
   * @async - Async function
   * @param {number} nbUsers - Number of users
   */
  async nbUsers() {
    await this.DB_URL.collection('users').countDocuments();
  }

  /**
   * Gets a values count of files from MongoDB
   * @instance DBClient
   * @async - Async function
   * @param {number} nbFiles - Number of files
   */
  async nbFiles() {
    await this.DB_URL.collection('files').countDocuments();
  }
}

export default new DBClient();
