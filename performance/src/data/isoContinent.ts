export type Continent = 'Africa' | 'Americas' | 'Asia' | 'Europe' | 'Oceania';

const LOOKUP: Record<string, Continent> = Object.create(null);

function add(list: string, region: Continent): void {
  for (const code of list.trim().split(/\s+/)) {
    LOOKUP[code] = region;
  }
}

// Africa
add(
  [
    'DZA AGO BEN BWA BFA BDI CMR CPV CAF TCD COM COG COD CIV DJI EGY GNQ ERI',
    'SWZ ETH GAB GMB GHA GIN GNB KEN LSO LBR LBY MDG MWI MLI MRT MUS MYT MAR',
    'MOZ NAM NER NGA REU RWA STP SEN SYC SLE SOM ZAF SSD SDN TZA TGO TUN UGA',
    'ESH ZMB ZWE',
  ].join(' '),
  'Africa'
);

// Americas
add(
  [
    'ATG ARG ABW BHS BRB BLZ BOL BRA VGB CAN CYM CHL COL CRI CUB CUW DMA DOM',
    'ECU SLV GRL GRD GLP GTM GUY HTI HND JAM MTQ MEX MSR NIC PAN PRY PER PRI',
    'KNA LCA SPM VCT SUR TTO TCA USA URY VEN BES BMU BVT SGS ATF',
  ].join(' '),
  'Americas'
);

// Asia
add(
  [
    'AFG ARM AZE BHR BGD BTN BRN KHM CHN CYP GEO HKG IND IDN IRN IRQ ISR JPN',
    'JOR KAZ KWT KGZ LAO LBN MAC MYS MDV MNG MMR NPL PRK OMN PAK PSE PHL QAT',
    'SAU SGP KOR LKA SYR TWN TJK THA TLS TUR TKM ARE UZB VNM YEM',
  ].join(' '),
  'Asia'
);

// Europe
add(
  [
    'ALB AND AUT BLR BEL BIH BGR HRV CZE DNK EST FRO FIN FRA DEU GIB GRC HUN',
    'ISL IRL IMN ITA XKX LVA LIE LTU LUX MLT MDA MCO MNE NLD MKD NOR POL PRT',
    'ROU RUS SMR SRB SVK SVN ESP SWE CHE UKR GBR VAT',
  ].join(' '),
  'Europe'
);

// Oceania
add(
  [
    'AUS FJI PYF GUM KIR MHL FSM NRU NCL NZL NIU MNP PLW PNG WSM SLB TKL TON',
    'TUV VUT WLF',
  ].join(' '),
  'Oceania'
);

export function continentFromIso(iso3: string | null): Continent | null {
  if (!iso3) {
    return null;
  }
  const c = LOOKUP[iso3.toUpperCase()];
  return c ?? null;
}
