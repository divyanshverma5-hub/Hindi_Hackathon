// कृषिवाणी (KrishiVaani) - Agmarknet / data.gov.in API Service
// Connects to Government of India Open Data API when VITE_DATA_GOV_API_KEY is present
// Otherwise safely falls back to local Agmarknet historical sample dataset

export class AgmarknetApiService {
  constructor() {
    this.apiKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_DATA_GOV_API_KEY : null;
    this.baseUrl = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
  }

  isLiveApiConfigured() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 5);
  }

  /**
   * Fetch today's real wholesale prices from data.gov.in if key exists
   * @param {string} commodity - Hindi or English commodity name
   * @param {string} state - State filter (e.g. 'Madhya Pradesh', 'Maharashtra')
   */
  async fetchLivePrices({ commodity = 'Onion', state = null }) {
    if (!this.isLiveApiConfigured()) {
      return {
        isLive: false,
        source: 'Agmarknet (डेमो डेटा)',
        records: []
      };
    }

    try {
      let url = `${this.baseUrl}?api-key=${this.apiKey}&format=json&limit=10`;
      if (commodity) {
        url += `&filters[commodity]=${encodeURIComponent(commodity)}`;
      }
      if (state) {
        url += `&filters[state]=${encodeURIComponent(state)}`;
      }

      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) {
        throw new Error(`data.gov.in API returned HTTP ${res.status}`);
      }
      const data = await res.json();
      return {
        isLive: true,
        source: 'data.gov.in (सजीव सरकारी डेटा)',
        records: data.records || []
      };
    } catch (err) {
      console.warn('[Agmarknet API Fallback]', err.message);
      return {
        isLive: false,
        source: 'Agmarknet (डेमो डेटा - ऑफ़लाइन बैकअप)',
        error: err.message,
        records: []
      };
    }
  }
}

export const agmarknetService = new AgmarknetApiService();
