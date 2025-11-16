export const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

export const validatePassword = (senha: string) =>
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(senha);
