import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Helper: fetch with timeout (5 seconds)
async function fetchWithTimeout(url: string, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const resp = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return resp;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

// Helper: detect booking engine signature
function detectEngine(html: string): string | null {
  const lower = html.toLowerCase();
  if (lower.includes('skip.staah.net') || lower.includes('be.staah.net')) return 'Staah';
  if (lower.includes('simplotel.com') || lower.includes('book.simplotel.com')) return 'Simplotel';
  if (lower.includes('hotels.cloudbeds.com')) return 'Cloudbeds';
  if (lower.includes('resnexus.com')) return 'ResNexus';
  return null;
}

// Helper: extract price from HTML (simple regex fallback)
function extractPrice(html: string): number | null {
  const priceRegex = /(?:Starting From|Best Available Rate)\s*₹?\s*([0-9,]{2,})/i;
  const match = html.match(priceRegex);
  if (match) {
    const num = parseInt(match[1].replace(/,/g, ''), 10);
    return isNaN(num) ? null : num;
  }
  // Generic price pattern
  const generic = /₹\s?([0-9,]{2,})/i;
  const genMatch = html.match(generic);
  if (genMatch) {
    const num = parseInt(genMatch[1].replace(/,/g, ''), 10);
    return isNaN(num) ? null : num;
  }
  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Expect JSON payload with at least hotelName, city, mmt_price (optional)
  let payload: any = {};
  try {
    payload = await req.json();
  } catch {
    // ignore parsing errors
  }
  const hotelName: string = payload.hotelName || '';
  const city: string = payload.city || '';
  const mmtPrice: number | null = payload.mmt_price ?? null;

  // Step A: Locate Official Site via Serper.dev
  const serperKey = Deno.env.get('SERPER_API_KEY') || '';
  let officialUrl = '';
  if (serperKey) {
    try {
      const q = `${hotelName} ${city} official website`;
      const serperResp = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': serperKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ q }),
      });
      const serperData = await serperResp.json();
      if (Array.isArray(serperData?.organic)) {
        for (const item of serperData.organic) {
          const link = item.link as string;
          if (!/booking\.com|makemytrip\.com|agoda\.com/i.test(link)) {
            officialUrl = link;
            break;
          }
        }
      }
    } catch (e) {
      console.error('Serper error', e);
    }
  }

  // Step B & C: Engine detection & price extraction
  let directPrice: number | null = null;
  let engine: string | null = null;
  if (officialUrl) {
    try {
      const resp = await fetchWithTimeout(officialUrl);
      const html = await resp.text();
      engine = detectEngine(html);
      if (engine) {
        directPrice = extractPrice(html);
      }
    } catch (e) {
      console.error('Fetch error', e);
    }
  }

  // Step D: Build response
  const savings = (mmtPrice && directPrice) ? mmtPrice - directPrice : null;
  const savingsLogic = savings ? `You save ₹${savings.toLocaleString('en-IN')} by bypassing MMT commission` : null;

  const result = {
    official_url: officialUrl,
    booking_engine: engine,
    direct_price: directPrice,
    mmt_price: mmtPrice,
    savings_logic: savingsLogic,
    hotelName,
    city,
    hasCustomVideo: false,
    video_url: null,
    whatsapp_number: payload.whatsapp_number || null,
  };

  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
});
