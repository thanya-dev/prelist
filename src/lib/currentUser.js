// The prototype's active account; replace this adapter when authentication is connected.
const CURRENT_USER = { email: 'thanya@buddyreview.co', role: 'Buyer' };

export function getCurrentUser() {
  return CURRENT_USER;
}
