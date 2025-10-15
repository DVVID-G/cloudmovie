

class GlobalDao {
    private model: any;
    constructor(model: any) {
        this.model = model;
    }
    async create(data: any) {
        const document = new this.model(data);
        return await document.save();
    }   
    async read(id: string) {
        return await this.model.findById(id);
    }
    async list(query: any = {}) {
        return await this.model.find(query).lean();
    }
    async update(id: string, data: any) {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id: string) {
        return await this.model.findByIdAndDelete(id);
    }
}
module.exports = { GlobalDao };
