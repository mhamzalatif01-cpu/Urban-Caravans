// Simple shared-passcode gate for a small internal team.
// Not a full auth system — good enough for "me + a couple of colleagues"
// keeping this off the open internet, not for sensitive data.
export function checkPasscode(req) {
  const expected = process.env.TEAM_PASSCODE;
  if (!expected) return true; // if no passcode is configured, allow (dev convenience)
  const provided = req.headers.get('x-team-passcode');
  return provided === expected;
}
