const getBooleanFromString = (value: string | undefined, def = false) => {
  if (value === undefined || value === '') return def;

  return ['true', '1', 'yes', 'enabled'].includes(value.toLowerCase());
};

export const getEnv = (): EnvFile => {
  const env = process.env as unknown as RawEnvFile;

  return {
    apiKeys: JSON.parse(env.API_KEYS),
    openApiDocs: getBooleanFromString(env.OPEN_API_DOCS, false),
  };
};

interface EnvFile {
  apiKeys: string[];
  openApiDocs: boolean;
}

class RawEnvFile {
  API_KEYS: string;
  OPEN_API_DOCS?: string;
}
