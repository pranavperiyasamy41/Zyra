/**
 * Extracts the IP address from the Express request object.
 * Handles headers set by proxies (like Nginx, Cloudflare, etc.)
 * Cleans up IPv6-mapped IPv4 addresses (::ffff:127.0.0.1 -> 127.0.0.1)
 * @param {Object} req - Express Request Object
 * @returns {string} - Clean IP Address
 */
export const getIp = (req) => {
    let ip = req.headers['x-forwarded-for']?.split(',')[0] || 
             req.headers['x-real-ip'] || 
             req.socket.remoteAddress || 
             req.ip || 
             'Unknown';

    // Handle IPv6-mapped IPv4 addresses (e.g., ::ffff:127.0.0.1)
    if (ip.startsWith('::ffff:')) {
        ip = ip.split(':').pop();
    }

    // Handle Localhost IPv6
    if (ip === '::1') {
        return '127.0.0.1 (Localhost)';
    }

    return ip;
};