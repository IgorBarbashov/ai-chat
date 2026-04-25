export const getToken = (): string => {
  const token = import.meta.env.VITE_GIGACHAT_TOKEN;
  if (!token) {
    throw new Error('VITE_GIGACHAT_TOKEN is not set');
  }
  return token as string;
};
