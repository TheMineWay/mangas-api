export const getEnv = (): EnvFile => {
  const env = process.env as unknown as RawEnvFile;

  return {
    apiKeys: JSON.parse(env.API_KEYS),
  };
};

interface EnvFile {
  apiKeys: string[];
}

class RawEnvFile {
  API_KEYS: string;
}
