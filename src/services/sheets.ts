import process from "node:process";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";

process.loadEnvFile();

class GoogleSheetService {
  private doc: GoogleSpreadsheet;

  constructor() {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ]
    });

    this.doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID!, serviceAccountAuth);
  }

  async loadDoc() {
    await this.doc.loadInfo();
  }

  async getSheetByIndex(index = 0): Promise<GoogleSpreadsheetWorksheet> {
    if (!this.doc) {
      throw new Error('Google Spreadsheet not loaded');
    }
    return this.doc.sheetsByIndex[index];
  }

  async findByDni(dni: string): Promise<string> {
    await this.loadDoc();
    const sheet = await this.getSheetByIndex();
    const rows = await sheet.getRows();
    const result = rows.filter(row => row.get('Dni') === dni).map(row => ({
      lote: row.get('lote'),
      peso: row.get('peso'),
      patente: row.get('patente'),
      fecha: row.get('fecha')
    }));

    if (result.length === 0) {
      return `No se encontraron resultados para el DNI ${dni}.`;
    }

    let message = `Resultados para el DNI ${dni}:\n`;
    result.forEach((res, index) => {
      message += `\nResultado ${index + 1}:\n`;
      message += `Lote: ${res.lote}\n`;
      message += `Peso: ${res.peso}\n`;
      message += `Patente: ${res.patente}\n`;
      message += `Fecha: ${res.fecha}\n`;
    });

    return message;
  }
}

export default GoogleSheetService;
