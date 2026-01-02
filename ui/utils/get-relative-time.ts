import { dayjs } from "@/lib/dayjs";

export function getRelativeTime(date: Date | string): string | null {
  const now = dayjs();
  const futureDate = dayjs(date);
  const diff = futureDate.diff(now, "minute");

  if (diff <= 0) {
    return null;
  }

  let unit: "minute" | "hour" | "day" | "week" | "month";
  if (diff < 60) unit = "minute";
  else if (diff < 1440) unit = "hour";
  else if (diff < 10080) unit = "day";
  else if (diff < 43200) unit = "week";
  else unit = "month";

  const relativeTime = futureDate.fromNow(true);
  return relativeTime;
}
