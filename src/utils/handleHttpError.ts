import { Response } from 'express';

function handleHttpError(
  res: Response,
  message: string = 'Something happened, but the team is working to solve it',
  code: number = 443
): void {
  res.status(code);
  res.send({ message: message })
}

export default handleHttpError;