/**
 * BaseModel - A reusable model class for create and update operations
 */
class BaseModel {
  constructor(data = {}) {
    this.data = data;
    this.errors = {};
  }

  /**
   * Validate the model data
   * @returns {boolean} - Returns true if validation passes
   */
  validate() {
    this.errors = {};
    return Object.keys(this.errors).length === 0;
  }

  /**
   * Create a new record
   * @param {Object} data - The data to create
   * @returns {Promise<Object>} - The created record
   */
  async create(data) {
    this.data = { ...this.data, ...data };
    
    if (!this.validate()) {
      throw new Error('Validation failed');
    }

    try {
      // This should be implemented by the child class
      const response = await this.performCreate();
      return response;
    } catch (error) {
      throw new Error(`Create operation failed: ${error.message}`);
    }
  }

  /**
   * Update an existing record
   * @param {string|number} id - The ID of the record to update
   * @param {Object} data - The data to update
   * @returns {Promise<Object>} - The updated record
   */
  async update(id, data) {
    this.data = { ...this.data, ...data };
    
    if (!this.validate()) {
      throw new Error('Validation failed');
    }

    try {
      // This should be implemented by the child class
      const response = await this.performUpdate(id);
      return response;
    } catch (error) {
      throw new Error(`Update operation failed: ${error.message}`);
    }
  }

  /**
   * Get all records
   * @returns {Promise<Array>} - Array of records
   */
  async getAll() {
    try {
      // This should be implemented by the child class
      const response = await this.performGetAll();
      return response;
    } catch (error) {
      throw new Error(`Get all operation failed: ${error.message}`);
    }
  }

  /**
   * Get a single record by ID
   * @param {string|number} id - The ID of the record to get
   * @returns {Promise<Object>} - The requested record
   */
  async getById(id) {
    try {
      // This should be implemented by the child class
      const response = await this.performGetById(id);
      return response;
    } catch (error) {
      throw new Error(`Get by ID operation failed: ${error.message}`);
    }
  }

  /**
   * Delete a record
   * @param {string|number} id - The ID of the record to delete
   * @returns {Promise<boolean>} - True if deletion was successful
   */
  async delete(id) {
    try {
      // This should be implemented by the child class
      const response = await this.performDelete(id);
      return response;
    } catch (error) {
      throw new Error(`Delete operation failed: ${error.message}`);
    }
  }

  // Abstract methods to be implemented by child classes
  async performCreate() {
    throw new Error('performCreate must be implemented by child class');
  }

  async performUpdate(id) {
    throw new Error('performUpdate must be implemented by child class');
  }

  async performGetAll() {
    throw new Error('performGetAll must be implemented by child class');
  }

  async performGetById(id) {
    throw new Error('performGetById must be implemented by child class');
  }

  async performDelete(id) {
    throw new Error('performDelete must be implemented by child class');
  }
}

export default BaseModel; 