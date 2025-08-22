export function labelFromKey(key: string): string {
  const ACRONYMS = new Set([
    'co2',
    'ghg',
    'gdp',
    'ch4',
    'n2o',
    'oecd',
    'eu',
    'usa',
    'uk',
  ]);
  const SMALL = new Set([
    'of',
    'and',
    'or',
    'per',
    'from',
    'to',
    'in',
    'on',
    'for',
    'by',
    'with',
    'a',
    'an',
    'the',
  ]);
  const tokens = key.split('_').filter(Boolean);
  if (tokens.length === 0) {
    return '';
  }
  const out: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const raw = tokens[i];
    if (raw == null) {
      continue;
    }
    const t = raw.toLowerCase();
    if (ACRONYMS.has(t)) {
      out.push(t.toUpperCase());
      continue;
    }
    if (t === 'luc') {
      out.push('LUC');
      continue;
    }
    if (t === 'lucf') {
      out.push('LUCF');
      continue;
    }
    if (t === 'prct') {
      out.push('%');
      continue;
    }
    if (i !== 0 && SMALL.has(t)) {
      out.push(t);
      continue;
    }
    out.push(t.charAt(0).toUpperCase() + t.slice(1));
  }
  return out.join(' ');
}
