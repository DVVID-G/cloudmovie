"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Simple in-memory token blacklist for JWT revocation.
 * For production, use a shared store like Redis with TTL.
 */
class TokenBlacklist {
    store; // token -> expiresAt (ms)
    constructor() {
        this.store = new Map();
        // periodic cleanup every 10 minutes
        setInterval(() => this.cleanup(), 10 * 60 * 1000).unref?.();
    }
    /**
     * Revoke a token until its expiration time.
     * @param {string} token
     * @param {number} expiresAtMs - epoch milliseconds when token expires
     */
    revoke(token, expiresAtMs) {
        this.store.set(token, expiresAtMs);
    }
    /**
     * Check if a token is currently revoked.
     * @param {string} token
     * @returns {boolean}
     */
    isRevoked(token) {
        const exp = this.store.get(token);
        if (!exp)
            return false;
        if (Date.now() >= exp) {
            this.store.delete(token);
            return false;
        }
        return true;
    }
    cleanup() {
        const now = Date.now();
        for (const [token, exp] of this.store.entries()) {
            if (now >= exp)
                this.store.delete(token);
        }
    }
}
module.exports = new TokenBlacklist();
//# sourceMappingURL=tokenBlacklist.js.map