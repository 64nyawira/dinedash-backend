import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export class MultiSupportService {
  private supportedLanguages = ['en', 'fr', 'es', 'de', 'sw']; // English, French, Spanish, German, Swahili
  private exchangeRates: { [key: string]: number } = {}; // Stores latest currency rates

  constructor() {
    this.updateExchangeRates(); // Update rates on initialization
  }

  // Fetch latest exchange rates from an API (e.g., OpenExchangeRates)
  async updateExchangeRates() {
    try {
      const response = await axios.get(`https://open.er-api.com/v6/latest/USD`, {
        params: { apikey: process.env.EXCHANGE_API_KEY },
      });

      this.exchangeRates = response.data.rates;
      console.log('✅ Exchange rates updated:');
    } catch (error) {
      console.error('❌ Failed to fetch exchange rates:', error);
    }
  }

  // Convert currency using stored exchange rates
  convertCurrency(amount: number, currency: string): number {
    if (!this.exchangeRates[currency]) {
      throw new Error(`Currency ${currency} not supported.`);
    }

    return amount * this.exchangeRates[currency];
  }

  // Translate text using Google Translate API
  async translateInterface(text: string, targetLanguage: string): Promise<string> {
    if (!this.supportedLanguages.includes(targetLanguage)) {
      throw new Error(`Language ${targetLanguage} not supported.`);
    }

    try {
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2`,
        {
          q: text,
          target: targetLanguage,
          key: process.env.GOOGLE_TRANSLATE_API_KEY,
        }
      );

      return response.data.data.translations[0].translatedText;
    } catch (error) {
      console.error('❌ Translation failed:', error);
      throw new Error('Translation service unavailable.');
    }
  }
}
