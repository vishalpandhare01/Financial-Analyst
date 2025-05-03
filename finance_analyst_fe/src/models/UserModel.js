import BaseModel from './BaseModel';

class UserModel extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.requiredFields = ['email', 'name'];
  }

  validate() {
    this.errors = {};
    
    // Check required fields
    this.requiredFields.forEach(field => {
      if (!this.data[field]) {
        this.errors[field] = `${field} is required`;
      }
    });

    // Email validation
    if (this.data.email && !this.isValidEmail(this.data.email)) {
      this.errors.email = 'Invalid email format';
    }

    return Object.keys(this.errors).length === 0;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async performCreate() {
    // Implement your API call here
    // Example:
    // const response = await api.post('/users', this.data);
    // return response.data;
    return this.data;
  }

  async performUpdate(id) {
    // Implement your API call here
    // Example:
    // const response = await api.put(`/users/${id}`, this.data);
    // return response.data;
    return { ...this.data, id };
  }

  async performGetAll() {
    // Implement your API call here
    // Example:
    // const response = await api.get('/users');
    // return response.data;
    return [];
  }

  async performGetById(id) {
    // Implement your API call here
    // Example:
    // const response = await api.get(`/users/${id}`);
    // return response.data;
    return { ...this.data, id };
  }

  async performDelete(id) {
    // Implement your API call here
    // Example:
    // await api.delete(`/users/${id}`);
    return true;
  }
}

export default UserModel; 