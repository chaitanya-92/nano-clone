export type CountryOption = {
  code: string;
  name: string;
  currency: string;
  symbol: string;
};

const COUNTRY_ROWS = `
AW|AWG|AWG
AF|AFN|AFN
AO|AOA|AOA
AI|XCD|EC$
AX|EUR|€
AL|ALL|ALL
AD|EUR|€
AE|AED|AED
AR|ARS|ARS
AM|AMD|AMD
AS|USD|$
AQ|USD|$
TF|EUR|€
AG|XCD|EC$
AU|AUD|A$
AT|EUR|€
AZ|AZN|AZN
BI|BIF|BIF
BE|EUR|€
BJ|XOF|F CFA
BQ|USD|$
BF|XOF|F CFA
BD|BDT|BDT
BG|EUR|€
BH|BHD|BHD
BS|BSD|BSD
BA|BAM|BAM
BL|EUR|€
BY|BYN|BYN
BZ|BZD|BZD
BM|BMD|BMD
BO|BOB|BOB
BR|BRL|R$
BB|BBD|BBD
BN|BND|BND
BT|INR|₹
BV|NOK|NOK
BW|BWP|BWP
CF|XAF|FCFA
CA|CAD|CA$
CC|AUD|A$
CH|CHF|CHF
CL|CLP|CLP
CN|CNY|CN¥
CI|XOF|F CFA
CM|XAF|FCFA
CD|CDF|CDF
CG|XAF|FCFA
CK|NZD|NZ$
CO|COP|COP
KM|KMF|KMF
CV|CVE|CVE
CR|CRC|CRC
CU|CUP|CUP
CW|XCG|Cg.
CX|AUD|A$
KY|KYD|KYD
CY|EUR|€
CZ|CZK|CZK
DE|EUR|€
DJ|DJF|DJF
DM|XCD|EC$
DK|DKK|DKK
DO|DOP|DOP
DZ|DZD|DZD
EC|USD|$
EG|EGP|EGP
ER|ERN|ERN
EH|MAD|MAD
ES|EUR|€
EE|EUR|€
ET|ETB|ETB
FI|EUR|€
FJ|FJD|FJD
FK|FKP|FKP
FR|EUR|€
FO|DKK|DKK
FM|USD|$
GA|XAF|FCFA
GB|GBP|£
GE|GEL|GEL
GG|GBP|£
GH|GHS|GHS
GI|GIP|GIP
GN|GNF|GNF
GP|EUR|€
GM|GMD|GMD
GW|XOF|F CFA
GQ|XAF|FCFA
GR|EUR|€
GD|XCD|EC$
GL|DKK|DKK
GT|GTQ|GTQ
GF|EUR|€
GU|USD|$
GY|GYD|GYD
HK|HKD|HK$
HM|AUD|A$
HN|HNL|HNL
HR|EUR|€
HT|HTG|HTG
HU|HUF|HUF
ID|IDR|IDR
IM|GBP|£
IN|INR|₹
IO|USD|$
IE|EUR|€
IR|IRR|IRR
IQ|IQD|IQD
IS|ISK|ISK
IL|ILS|₪
IT|EUR|€
JM|JMD|JMD
JE|GBP|£
JO|JOD|JOD
JP|JPY|¥
KZ|KZT|KZT
KE|KES|KES
KG|KGS|KGS
KH|KHR|KHR
KI|AUD|A$
KN|XCD|EC$
KR|KRW|₩
KW|KWD|KWD
LA|LAK|LAK
LB|LBP|LBP
LR|LRD|LRD
LY|LYD|LYD
LC|XCD|EC$
LI|CHF|CHF
LK|LKR|LKR
LS|ZAR|ZAR
LT|EUR|€
LU|EUR|€
LV|EUR|€
MO|MOP|MOP
MF|EUR|€
MA|MAD|MAD
MC|EUR|€
MD|MDL|MDL
MG|MGA|MGA
MV|MVR|MVR
MX|MXN|MX$
MH|USD|$
MK|MKD|MKD
ML|XOF|F CFA
MT|EUR|€
MM|MMK|MMK
ME|EUR|€
MN|MNT|MNT
MP|USD|$
MZ|MZN|MZN
MR|MRU|MRU
MS|XCD|EC$
MQ|EUR|€
MU|MUR|MUR
MW|MWK|MWK
MY|MYR|MYR
YT|EUR|€
NA|ZAR|ZAR
NC|XPF|CFPF
NE|XOF|F CFA
NF|AUD|A$
NG|NGN|NGN
NI|NIO|NIO
NU|NZD|NZ$
NL|EUR|€
NO|NOK|NOK
NP|NPR|NPR
NR|AUD|A$
NZ|NZD|NZ$
OM|OMR|OMR
PK|PKR|PKR
PA|PAB|PAB
PN|NZD|NZ$
PE|PEN|PEN
PH|PHP|₱
PW|USD|$
PG|PGK|PGK
PL|PLN|PLN
PR|USD|$
KP|KPW|KPW
PT|EUR|€
PY|PYG|PYG
PS|ILS|₪
PF|XPF|CFPF
QA|QAR|QAR
RE|EUR|€
RO|RON|RON
RU|RUB|RUB
RW|RWF|RWF
SA|SAR|SAR
SD|SDG|SDG
SN|XOF|F CFA
SG|SGD|SGD
GS|GBP|£
SH|SHP|SHP
SJ|NOK|NOK
SB|SBD|SBD
SL|SLE|SLE
SV|USD|$
SM|EUR|€
SO|SOS|SOS
PM|EUR|€
RS|RSD|RSD
SS|SSP|SSP
ST|STN|STN
SR|SRD|SRD
SK|EUR|€
SI|EUR|€
SE|SEK|SEK
SZ|SZL|SZL
SX|XCG|Cg.
SC|SCR|SCR
SY|SYP|SYP
TC|USD|$
TD|XAF|FCFA
TG|XOF|F CFA
TH|THB|THB
TJ|TJS|TJS
TK|NZD|NZ$
TM|TMT|TMT
TL|USD|$
TO|TOP|TOP
TT|TTD|TTD
TN|TND|TND
TR|TRY|TRY
TV|AUD|A$
TW|TWD|NT$
TZ|TZS|TZS
UG|UGX|UGX
UA|UAH|UAH
UM|USD|$
UY|UYU|UYU
US|USD|$
UZ|UZS|UZS
VA|EUR|€
VC|XCD|EC$
VE|VES|VES
VG|USD|$
VI|USD|$
VN|VND|₫
VU|VUV|VUV
WF|XPF|CFPF
WS|WST|WST
YE|YER|YER
ZA|ZAR|ZAR
ZM|ZMW|ZMW
ZW|ZWG|ZiG
XK|EUR|€
`;

const regionNames = new Intl.DisplayNames(["en"], {
  type: "region",
});

export const countries: CountryOption[] = COUNTRY_ROWS
  .trim()
  .split("\n")
  .map((row) => {
    const [code, currency, symbol] = row.split("|");

    return {
      code,
      name: regionNames.of(code) ?? code,
      currency,
      symbol,
    };
  })
  .filter((country) => country.code !== "AQ")
  .sort((a, b) => a.name.localeCompare(b.name));

export const industries = [
  "AI & Machine Learning",
  "Software Development",
  "Developer Tools",
  "SaaS",
  "Cybersecurity",
  "Cloud & DevOps",
  "Data & Analytics",
  "Fintech",
  "Web3 & Blockchain",
  "E-commerce",
  "Marketing",
  "Sales",
  "Product Management",
  "Design & UX",
  "No-code & Automation",
  "Productivity",
  "Education & EdTech",
  "Career & Jobs",
  "Finance & Investing",
  "Accounting",
  "LegalTech",
  "HR & Recruitment",
  "HealthTech",
  "Fitness & Wellness",
  "Mental Health",
  "Beauty & Personal Care",
  "Fashion",
  "Food & Beverage",
  "Travel & Hospitality",
  "Real Estate",
  "Automotive",
  "Consumer Technology",
  "Gaming",
  "Creator Economy",
  "Social Media",
  "Startups & Entrepreneurship",
  "Business & Strategy",
  "Leadership",
  "Operations",
  "Sustainability",
  "ClimateTech",
  "Energy",
  "Biotech",
  "MedTech",
  "Telecom",
  "Hardware",
  "Robotics",
  "Electronics",
  "Photography",
  "Video & Film",
  "Writing & Publishing",
  "Lifestyle"
] as const;

export function getIndustrySuggestions(headline: string) {
  const value = headline.trim().toLowerCase();
  const matched = Object.entries(industryRules)
    .filter(([, keywords]) =>
      keywords.some((keyword) => value.includes(keyword)),
    )
    .map(([industry]) => industry);

  return [
    ...matched,
    ...industries.filter((industry) => !matched.includes(industry)),
  ];
}

const industryRules: Record<string, string[]> = {
  "AI & Machine Learning": ["ai","machine learning","ml","llm","genai","generative"],
  "Software Development": ["developer","software","programming","engineer","coding","dev"],
  "Developer Tools": ["developer tools","devtools","api","sdk","framework","developer"],
  "SaaS": ["saas","b2b software","cloud software"],
  "Cybersecurity": ["security","cyber","infosec","privacy","zero trust"],
  "Cloud & DevOps": ["cloud","devops","kubernetes","docker","platform engineering","aws","azure"],
  "Data & Analytics": ["data","analytics","bi","business intelligence","sql"],
  "Fintech": ["fintech","payments","banking","neobank","finance technology"],
  "Web3 & Blockchain": ["web3","blockchain","crypto","defi"],
  "E-commerce": ["ecommerce","e-commerce","shopify","retail"],
  "Marketing": ["marketing","growth","brand","content marketing"],
  "Sales": ["sales","revenue","gtm","go-to-market","business development"],
  "Product Management": ["product manager","product management","pm"],
  "Design & UX": ["designer","design","ux","ui","user experience"],
  "No-code & Automation": ["automation","zapier","no-code","nocode","workflow"],
  "Education & EdTech": ["education","teacher","learning","edtech"],
  "Career & Jobs": ["career","jobs","recruiting","resume","interview"],
  "HealthTech": ["healthtech","health tech","healthcare","hospital"],
  "Fitness & Wellness": ["fitness","wellness","gym","nutrition"],
  "Travel & Hospitality": ["travel","hotel","hospitality","tourism"],
  "Real Estate": ["real estate","property","realtor","housing"],
  "Automotive": ["automotive","car","ev","vehicle"],
  "Gaming": ["gaming","game developer","esports"],
  "Creator Economy": ["creator","influencer","ugc","creator economy"],
  "Social Media": ["social media","linkedin","instagram","youtube","tiktok","twitter","x.com"],
  "Startups & Entrepreneurship": ["startup","founder","entrepreneur","venture"],
  "Business & Strategy": ["strategy","business","consulting"],
  "Leadership": ["leadership","leader","executive"],
  "Sustainability": ["sustainability","sustainable","esg"],
  "ClimateTech": ["climate","carbon","climatetech"],
  "Biotech": ["biotech","genomics","biology"],
  "MedTech": ["medtech","medical device","medical"],
  "Hardware": ["hardware","device","iot"],
  "Robotics": ["robotics","robot"],
  "Photography": ["photography","photographer"],
  "Video & Film": ["video","filmmaker","film","videographer"],
  "Writing & Publishing": ["writer","writing","author","publishing","copywriter"],
  "Fashion": ["fashion","apparel","style"],
  "Food & Beverage": ["food","beverage","restaurant","chef"],
  "Beauty & Personal Care": ["beauty","cosmetics","skincare"],
};

export const currencySymbols: Record<string, string> = Object.fromEntries(
  countries.map((country) => [country.code, country.symbol]),
);
