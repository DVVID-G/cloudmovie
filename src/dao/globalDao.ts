/**
 * GlobalDao: generic data access layer for a Mongoose-like model.
 * Provides basic CRUD operations used by controllers.
 */
class GlobalDao {
    private model: any;
    /**
     * @param {any} model - A persistence model exposing Mongoose-like APIs (save, find, findById, etc.)
     */
    constructor(model: any) {
        this.model = model;
    }
    /** Create a new document */
    async create(data: any) {
        const document = new this.model(data);
        return await document.save();
    }   
    /** Read a document by id */
    async read(id: string) {
        return await this.model.findById(id);
    }
    /** List documents; accepts optional query */
    async list(query: any = {}) {
        return await this.model.find(query).lean();
    }
    /** Update a document by id */
    async update(id: string, data: any) {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }
    /** Delete a document by id */
    async delete(id: string) {
        return await this.model.findByIdAndDelete(id);
    }
}
module.exports = { GlobalDao };
