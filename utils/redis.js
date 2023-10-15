import { createClient } from 'redis';
/**
 * Redis client
 * @class {RedisClient}
 */
class RedisClient {
  /**
  * Creates a new Redis instance.
  * @constructor RedisClient
  * @param {string} host - Redis host
  * @param {number} port - Redis port
  * @memberof RedisClient
  * @instance RedisClient
  * @returns {object} - Redis client
  * @throws {error} - Throws an error if any
  */
  constructor() {
    this.client = createClient({
      host: 'localhost',
      port: 6379,
    });
    this.client.on('Redis Connection', () => {
      console.log('Redis client connected to the server');
    });
    this.client.on('Redis Errors:', (err) => {
      console.log('Connection failed ', err);
    });
  }

  /**
  * Checks if Redis client is alive
  * @returns {boolean} true if client is alive, false otherwise
  * @memberof RedisClient
  * @method isAlive  - Checks if Redis client is alive
  * @instance RedisClient
  */
  isAlive() {
    if (!this.client) {
      return false;
    }
    return true;
  }

  /**
   * Gets a value from Redis
   * @param {string} key - Key to get
   * @returns {string} - Value of key
   * @memberof RedisClient
   * @method get - Gets a value from Redis
   * @instance RedisClient
   * @throws {error} - Throws an error if any
   * @async - Async function
   */
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, data) => {
        if (err) reject(err, console.log('Error: ', err));
        resolve(data);
      });
    });
  }

  /**
   * Sets a value from Redis
   * @param {string} key - Key to get
   * @param {string} value - Value to set
   * @param {string} duration - Duration to set
   * @returns {string} - Value of key
   * @memberof RedisClient
   * @method  set - Sets a value in Redis
   * @instance RedisClient
   * @throws {error} - Throws an error if any
   * @async - Async function
   */
  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, 'EX', duration, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  /**
   * Dels a value from Redis
   * @param {string} key - Key to get
   * @returns {string} - Value of key
   * @memberof RedisClient
   * @method del - Dels a value from Redis
   * @instance RedisClient
   * @throws {error} - Throws an error if any
   * @async - Async function
   */
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }
}

export default new RedisClient();
