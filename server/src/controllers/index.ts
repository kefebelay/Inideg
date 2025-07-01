import { Request, Response } from 'express';

class IndexController {
    public async getAllItems(req: Request, res: Response): Promise<void> {
        // Logic to retrieve all items from the database
    }

    public async createItem(req: Request, res: Response): Promise<void> {
        // Logic to create a new item in the database
    }
}

export default IndexController;