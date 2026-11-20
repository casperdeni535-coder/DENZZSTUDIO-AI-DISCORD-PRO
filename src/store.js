const cooldowns = new Map();
function isOnCooldown(userId, durationMs = 8000) {
  const now = Date.now();
  const until = cooldowns.get(userId) || 0;
  if (until > now) return Math.ceil((until - now) / 1000);
  cooldowns.set(userId, now + durationMs);
  return 0;
}
module.exports = { isOnCooldown };
