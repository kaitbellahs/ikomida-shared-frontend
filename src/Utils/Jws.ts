import {
  importSPKI,
  compactVerify,
  // CompactEncrypt
} from 'jose';
const algorithm = 'PS256';
//TODO: configure as environemnt list
const spki: any = {
  production: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxUGOcRbLPc0+r1+JWeRp
Ckv9NWyWfbrQ+COJCVNEp0oheDhKW7pe2Hi5mu6aPzKAE9gC8HBR/BvOiNOPp9L9
7YAHpPRlDsvtmnqfzVy8nEZSUOb8Zu/uU9TDQkeE69oWOlxXjsv60Mwxe0aVFZZu
6Fj4MDk+ypVeLtcc8ITyS7sgUqBbyi4gAYtSHouLOb3N4U451TFaiEzEO+9yOhrR
sM/ETm6PPo5AcjXq8LqTit6c8HeTR2O6m60ARV8HyeRPEqbH2x8SN4HrjeuE6nbw
W9TRBGZCWJAgP1fgwWTqtNsowwARO415nFAwLaqjqI5+CVIYLOlXacPIxRXNDF0K
KQIDAQAB
-----END PUBLIC KEY-----`,
  homologation: `----- BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtITLI54Iz5OgDSciIP2C
fxgqUuZOGNDgGchpLxiUFt9ZHjhxOTdTe2SzaRpMSewHEQLXsPqqVbBI5Y3wnJes
RbslGed6ZSyZNraWpfLF3RgW9XUQcFHbDAq9eZmoRKpmU3iPfQIIsgUReJVVX5N0
ssFTY4nibHjfGSDYO8HL5moaQWMVSykPaUL9 / dNRk / kmcTVk3pTOMGvXRhc9cQTV
mEMlc1QhPWFCLT7hXY4zicWvNnaRJ1Vv3axFlmNH8QssOjwvqBzq + dvqzGWSzal7
NKX / mk + yLSgs6nQtQXti5Ui8PWYhpZABTlwxScThSXtpQCQK8KS5BCK6yxXUif3p
AwIDAQAB
----- END PUBLIC KEY-----`,
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
