/* global module, process */
const REQUIRED_FIELDS = ['project_id', 'private_key', 'client_email'];

const normalizePrivateKey = (value) => (typeof value === 'string' ? value.replace(/\\n/g, '\n').trim() : '');

function parseServiceAccountFromEnv() {
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!rawJson) return null;
  try {
    const parsedJson = JSON.parse(rawJson);
    return { ...parsedJson, private_key: normalizePrivateKey(parsedJson.private_key) };
  } catch {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY inválida: JSON malformado.');
  }
}

function parseServiceAccountFromSeparatedEnv() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
  if (!projectId && !clientEmail && !privateKey) return null;
  return { project_id: String(projectId || ''), client_email: String(clientEmail || ''), private_key: privateKey };
}

function getFirebaseServiceAccount() {
  const credentials = parseServiceAccountFromEnv() || parseServiceAccountFromSeparatedEnv();
  if (!credentials) return null;
  const missingField = REQUIRED_FIELDS.find((fieldName) => {
    const value = credentials[fieldName];
    return typeof value !== 'string' || !value.trim();
  });
  if (missingField) throw new Error(`Credencial Firebase incompleta: campo obrigatório ausente (${missingField}).`);
  return credentials;
}

function isFirebaseServiceAccountConfigured() {
  try {
    return Boolean(getFirebaseServiceAccount());
  } catch {
    return false;
  }
}

module.exports = { getFirebaseServiceAccount, isFirebaseServiceAccountConfigured };
