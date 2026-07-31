type QueryParamValue = string | string[] | number | undefined | null;

type FilterConfig = {
  field: string;
  type?: "equals" | "contains" | "in" | "lte" | "gte" | "lt" | "gt";
  nestedField?: string;
  mode?: "insensitive";
  transform?: (value: string) => unknown;
  parser?: (value: string) => { operator: string; value: unknown } | undefined;
};

type FilterMap = Record<string, FilterConfig>;

const normalizeSingleValue = (value: QueryParamValue): string | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value[0]?.toString().trim();
  }

  return value.toString().trim();
};

const normalizeStringArray = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const operatorMap: Record<NonNullable<FilterConfig["type"]>, string> = {
  equals: "equals",
  contains: "contains",
  in: "in",
  lte: "lte",
  gte: "gte",
  lt: "lt",
  gt: "gt",
};

export const buildQueryFilter = (
  query: Record<string, unknown>,
  filters: FilterMap,
): Record<string, unknown> | undefined => {
  const where: Record<string, unknown> = {};

  Object.entries(filters).forEach(([queryKey, config]) => {
    const rawValue = query[queryKey];

    if (rawValue === undefined || rawValue === null || rawValue === "") {
      return;
    }

    const normalizedValue = normalizeSingleValue(rawValue as QueryParamValue);

    if (normalizedValue === undefined) {
      return;
    }

    if (config.parser) {
      const parsed = config.parser(normalizedValue);

      if (!parsed) {
        return;
      }

      where[config.field] = config.nestedField
        ? { [config.nestedField]: { [parsed.operator]: parsed.value } }
        : { [parsed.operator]: parsed.value };

      return;
    }

    if (config.type === "in") {
      const values = config.transform
        ? config.transform(normalizedValue)
        : normalizeStringArray(normalizedValue);

      if (Array.isArray(values) && values.length > 0) {
        where[config.field] = config.nestedField
          ? { [config.nestedField]: { in: values } }
          : { in: values };
      }

      return;
    }

    const transformedValue = config.transform
      ? config.transform(normalizedValue)
      : normalizedValue;

    if (transformedValue === undefined) {
      return;
    }

    const operator = operatorMap[config.type ?? "equals"];
    const clause: Record<string, unknown> = { [operator]: transformedValue };
    if (config.mode) {
      clause.mode = config.mode;
    }

    where[config.field] = config.nestedField
      ? { [config.nestedField]: clause }
      : clause;
  });

  return Object.keys(where).length > 0 ? where : undefined;
};
