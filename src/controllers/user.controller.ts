import 'dotenv/config';
import { Request, Response } from 'express';
import handleHttpError from '../utils/handleHttpError';
import GoogleSheetService from '../services/sheets';

const sheetService = new GoogleSheetService();

export async function searchUserDni(req: Request, res: Response) {
  try {
    const { body: message } = req.body.ctx;

    const results = await sheetService.findByDni(message);

    const response = {
      messages: [
        {
          type: 'to_user',
          content: `Aquí verás el resultado de la busqueda ${results}`
        }
      ],
    }
    res.status(200).send(response);
  } catch (error) {
    handleHttpError(res, 'cannot sear user by dni')
  }
}