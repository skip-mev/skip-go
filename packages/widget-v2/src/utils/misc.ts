import crypto from 'crypto';

export const hashObject = (obj: any): string => {
  const str = JSON.stringify(obj);
  return crypto.createHash('sha256').update(str).digest('hex');
};
