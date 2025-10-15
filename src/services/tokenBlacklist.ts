// Deprecated: token blacklist removed in favor of stateless JWT.
// This module is intentionally left as a stub to avoid import errors if any lingering requires remain.
// Do not use. Remove any imports of '../services/tokenBlacklist' from the codebase.

module.exports = {
  revoke() {
    throw new Error('tokenBlacklist is deprecated. Use stateless JWT and let the client delete the token.');
  },
  isRevoked() {
    return false;
  }
};
