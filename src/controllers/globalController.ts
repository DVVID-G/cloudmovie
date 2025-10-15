/**
 * Base controller providing generic CRUD HTTP handlers.
 * Delegates data access to an injected DAO.
 */
class GlobalController {
    private dao: any;
    /**
     * @param {any} dao - Data Access Object with create/read/list/update/delete methods
     */
    constructor(dao: any) {
        this.dao = dao;
    }  
    /**
     * Create a new resource
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async create(req: any, res: any) {
        console.log("Creating user with data:", req.body);
        try {
            const created = await this.dao.create(req.body);
            res.status(201).json(created);
        } catch (error) {
            // Handle duplicate key error from Mongo (code 11000) or generic
            if (error && (error as any).code === 11000) {
                return res.status(409).json({ error: 'El correo ya está registrado' });
            }
            console.error('Create error:', error);
            res.status(500).json({ error: 'Error interno al crear recurso' });
        }
    }
    /**
     * Read a resource by id
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async read(req: any, res: any) {
        try {
            const user = await this.dao.read(req.params.id);
            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({ error});
        }
    }
    /**
     * List resources
     * @param {import('express').Request} _req
     * @param {import('express').Response} res
     */
    async list(_req: any, res: any) {
        try {
            const items = await this.dao.list();
            res.status(200).json(items);
        } catch (error) {
            console.error('List error:', error);
            res.status(500).json({ error: 'Error interno al listar recursos' });
        }
    }
    /**
     * Update a resource by id
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async update(req: any, res: any) {
        try {
            const updated = await this.dao.update(req.params.id, req.body);
            res.status(200).json(updated);
        } catch (error) {
            console.error('Update error:', error);
            res.status(500).json({ error: 'Error interno al actualizar recurso' });
        }
    }
    /**
     * Delete a resource by id
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async delete(req: any, res: any) {
        try {
            const removed = await this.dao.delete(req.params.id);
            res.status(200).json(removed);
        } catch (error) {
            console.error('Delete error:', error);
            res.status(500).json({ error: 'Error interno al eliminar recurso' });
        }
    }

}

module.exports = GlobalController;