export function chapterUrl(chapter: string, rule?: string) {
  const params = new URLSearchParams({ chapter });
  if (rule) params.set("rule", rule);
  return `/rules?${params}`;
}
