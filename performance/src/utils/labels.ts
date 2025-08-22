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

const SMALL_WORDS = new Set([
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

function transformToken(token: string, isFirst: boolean): string {
  const t = token.toLowerCase();
  if (ACRONYMS.has(t)) {
    return t.toUpperCase();
  }
  if (t === 'luc') {
    return 'LUC';
  }
  if (t === 'lucf') {
    return 'LUCF';
  }
  if (t === 'prct') {
    return '%';
  }

  if (!isFirst && SMALL_WORDS.has(t)) {
    return t;
  }
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export function labelFromKey(key: string): string {
  const tokens = key.split('_').filter(Boolean);
  if (tokens.length === 0) {
    return '';
  }
  const parts: string[] = [];
  tokens.forEach((tok, idx) => {
    const part = transformToken(tok, idx === 0);
    parts.push(part);
  });
  return parts.join(' ');
}
