export type FeeRecord = {
  id: string | number;
  name: string;
  rate: number;
};

/** Normalizes RTK/PostgREST list responses ({ data: T[] } or T[]). */
export function getApiList<T extends FeeRecord = FeeRecord>(
  response: { data?: T[] } | T[] | null | undefined
): T[] {
  if (!response) return [];
  if (Array.isArray(response)) return response as T[];
  if (Array.isArray(response.data)) return response.data;
  return [];
}

export type SelectOption = {
  id: string;
  value: string;
  label: string;
  rate: number;
  name: string;
};

export function toFeeSelectOptions(items: FeeRecord[]): SelectOption[] {
  return items.map((item) => ({
    id: String(item.id),
    value: String(item.id),
    label: `${item.name} (${item.rate}%)`,
    rate: Number(item.rate) || 0,
    name: item.name,
  }));
}
