/**
 * GlobalDao: generic data access layer for a Mongoose-like model.
 * Provides basic CRUD operations used by controllers.
 *
 * Contract expected for `model`:
 * - constructor(data): new document instance
 * - save(): Promise<any>
 * - find(query): Query builder with lean()
 * - findById(id): Promise<any>
 * - findByIdAndUpdate(id, data, { new }): Promise<any>
 * - findByIdAndDelete(id): Promise<any>
 */
class GlobalDao {
    private model: any;
    /**
     * @param {any} model - A persistence model exposing Mongoose-like APIs (save, find, findById, etc.)
     */
    constructor(model: any) {
        this.model = model;
    }
    /**
     * Create a new document
     * @param {any} data - Plain object with fields for the model
     * @returns {Promise<any>} The persisted document
     */
    async create(data: any) {
        const document = new this.model(data);
        return await document.save();
    }   
    /**
     * Read a document by id
     * @param {string} id - Document identifier
     * @returns {Promise<any|null>} The document or null if not found
     */
    async read(id: string) {
        return await this.model.findById(id);
    }
    /**
     * List documents; accepts optional query
     * @param {any} [query={}] - Filter to apply in the list operation
     * @returns {Promise<any[]>} Array of documents (lean objects)
     */
    async list(query: any = {}) {
        return await this.model.find(query).lean();
    }
    /**
     * Update a document by id
     * @param {string} id - Document identifier
     * @param {any} data - Fields to update
     * @returns {Promise<any|null>} The updated document or null
     */
    async update(id: string, data: any) {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }
    /**
     * Delete a document by id
     * @param {string} id - Document identifier
     * @returns {Promise<any|null>} The removed document or null
     */
    async delete(id: string) {
        return await this.model.findByIdAndDelete(id);
    }
}
module.exports = { GlobalDao };
