const parseEnvNumber = (envVar: string): number => {
	const envVarValue = parseInt(process.env[envVar] || '');
	if (isNaN(envVarValue)) {
		throw new Error(`Environment variable ${envVar} is not a number`);
	}
	return envVarValue;
}

const parseEnvString = (envVar: string): string => {
	const envVarValue = process.env[envVar];
	if (!envVarValue) {
		throw new Error(`Environment variable ${envVar} is not set`);
	}
	return envVarValue;
}

const parseEnvBoolean = (envVar: string): boolean => {
	const envVarValue = process.env[envVar];
	if (!envVarValue) {
		throw new Error(`Environment variable ${envVar} is not set`);
	}
	return envVarValue === "true";
}

interface EnvVariables {
	SITENAME: string;
	HOST: string;
	SERVICE: string;
}

const getEnvVariables = (): EnvVariables => {
	const SITENAME = parseEnvString("REACT_APP_SITE_NAME");
	const HOST = parseEnvString("REACT_APP_BACKEND_HOST");
	const SERVICE = parseEnvString("REACT_APP_BACKEND_SERVICE");
	return { SITENAME, HOST, SERVICE};
}

export default getEnvVariables;

