import {
  importSPKI,
  compactVerify,
  // CompactEncrypt
} from 'jose';
const algorithm = 'PS256';
//TODO: configure as environemnt list
const spki: any = {
  production: `-----BEGIN PUBLIC KEY-----"
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2mVTPwaaCGfT0TnZoLsX
bTvDcAd6vfiNiCg541aojDFQJPgimJ4/aVOhs8edC5CkNSNxWGpSvhk5+ss0pqgZ
lGKpRQWxleOl27urGdz7W0rg5DLkNr1tu0jNTORPX0MTduWOmPlPEiyafcC1J4cB
8B5iwVZAf1006zpndhvuPTqRjjsbxkoXUhJJ8Z1HGDLeI46Eas2qg6WzoFv1N9l7
p5Z+8LCzDRdJrCdxxgk5iCG0OslmOJWrzccn0KvxS/UKY7i/VYV5Rj7mhCHH8Kfw
ZjpZaOgm23klxVnVl+ORntuvmCEBgrNnlKHTwdIy//SGHqxDzrQJj4nWVSoy5sjA
ewIDAQAB
-----END PUBLIC KEY-----`,
  homologation: `-----BEGIN PUBLIC KEY-----"
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0K74IW5Jx4Fbhl1+yRbS
0LMdvbRmHbdjMABxGwvHzBaMQsE+XOwPN/x5a5Q31UtUf9MnKpV9FgRwqhvsyahZ
QG2A4C934zreRUUzkIpqyM0erl6iEFFf8d1zgsj6hDGkvnHNygYd2pbuO3HLRiye
cYKHtVFbtJIl4GC9aJyDcwlAkWUZSxK8d1KYEQBra+f2jZfH/lI9SoABqK9hlnt4
wvSRNJK9zrMTTi8pm4gzgkmK4hMF08T5P2w6uurwDGw3vPEaHiqc8/EhU+qCZKzY
CKnQBS0hmz3o8Mvvu3AvkMZVGPMF66OrMrcp38uiBmZYtUL01Lr6GAStUqRGqKHB
TQIDAQAB
-----END PUBLIC KEY-----`,
  development: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoKZttLQ0QwYETl3axXnh
Lt8CuiaS4yAVvtJPfND0CuBFpgWqOn+tWh4pjyawGqoLHy/ehnQitLbdY9iS/juP
ufIDzoQVBXlZG+gQklGbsH6cVWaFKcSY+4ISgDd7XkQcvJbprgtbeiyXA14NRgNS
M5fB0t0jxmbAei5GMT9uPnD3hPAJ40BLmbdTT+5TMZk4HDvuDFKZ6w2rUzIo0Vql
Ohck9fb34QSBuUzLwNOR8Q43NIk7HMEo1UpBVhCEIWCsqCK0A7egSjbLvRxSYnDf
pvDJMGr/0FOcvd6hlHKyh7tgyj53aPKAW0ebj7LFxdzZxJj6Qdc5CoThUcKyGxk9
WQIDAQAB
-----END PUBLIC KEY-----`
};
export async function extractToken(token: string) {
  if (token == null || token === null || token === 'null') return null;
  try {
    const ecPublicKey = await importSPKI(spki[window.environment], algorithm);
    const { payload } = await compactVerify(token, ecPublicKey);
    return JSON.parse(new TextDecoder().decode(payload));
  } catch (error: any) {
    return null;
  }
}

// export async function signMessage(payload) {
//     const ecPublicKey = await importSPKI(spki, algorithm);
//     return new CompactEncrypt(new TextEncoder().encode(JSON.stringify(payload)))
//         .setProtectedHeader({
//             alg: 'RSA-OAEP-256',
//             enc: 'A256GCM'
//         })
//         .encrypt(ecPublicKey);
// }
