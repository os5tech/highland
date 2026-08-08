const environmentLabels = {
  alpha: "Alpha",
  development: "Development",
  live: "Live",
} as const;

type EnvironmentKey = keyof typeof environmentLabels;

function isEnvironmentKey(value: string): value is EnvironmentKey {
  return value in environmentLabels;
}

export function getRuntimeEnvironmentLabel() {
  const configured = process.env.KEYSTONE_ENVIRONMENT?.trim().toLowerCase();

  if (configured && isEnvironmentKey(configured)) {
    return environmentLabels[configured];
  }

  return process.env.NODE_ENV === "production" ? environmentLabels.alpha : environmentLabels.development;
}
