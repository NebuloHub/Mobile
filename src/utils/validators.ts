export function isValidatePassword(senha: string) {
  return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(senha);
}

export function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

export function isValidURL(url: string) {
  return /^https?:\/\/.+/.test(url);
}
