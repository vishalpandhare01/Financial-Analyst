import BaseModel from './BaseModel';
import { api } from '../services/api';

class ScenarioModel extends BaseModel {
    constructor(data = {}) {
        super(data);
        this.requiredFields = ['name', 'model_id'];
    }

    validate() {
        this.errors = {};
        
        // Check required fields
        this.requiredFields.forEach(field => {
            if (!this.data[field]) {
                this.errors[field] = `${field} is required`;
            }
        });

        return Object.keys(this.errors).length === 0;
    }

    async performCreate() {
        return await api.createScenario(this.data);
    }

    async performUpdate(id) {
        return await api.updateScenario(id, this.data);
    }

    async performGetAll() {
        return await api.getScenarios(this.data.model_id);
    }

    async performGetById(id) {
        const scenarios = await api.getScenarios(this.data.model_id);
        return scenarios.results.find(scenario => scenario.id === id);
    }

    async performDelete(id) {
        return await api.deleteScenario(id);
    }
}

export default ScenarioModel; 