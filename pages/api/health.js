export default async function handler(req, res) {
    try {
        const response = await fetch("https://radio-health.yuntae.in/health", {
            cache: 'no-store'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        res.status(200).json(data);
    } catch (error) {
        console.error("Health Proxy Error:", error);
        res.status(500).json({ error: "Failed to fetch health data" });
    }
}
