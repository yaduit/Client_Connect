import fetch from 'node-fetch';

export const reverseGeocode = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ message: 'lat and lon required' });

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&addressdetails=1`;
    const resp = await fetch(url, { headers: { 'User-Agent': 'ClientConnect/1.0' } });
    if (!resp.ok) return res.status(502).json({ message: 'Failed to fetch geocode' });
    const data = await resp.json();
    return res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
};

export const searchGeocode = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'q query required' });

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&addressdetails=1&limit=10`;
    const resp = await fetch(url, { headers: { 'User-Agent': 'ClientConnect/1.0' } });
    if (!resp.ok) return res.status(502).json({ message: 'Failed to fetch geocode search' });
    const data = await resp.json();
    return res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
};
