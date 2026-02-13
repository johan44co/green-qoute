import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

// Register locale
countries.registerLocale(en);

export type Country = {
  value: string;
  label: string;
};

// Get sorted list of all countries
export function getCountryList(): Country[] {
  return Object.entries(countries.getNames("en", { select: "official" }))
    .map(([value, label]) => ({
      value,
      label,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

// Get country name from ISO code
export function getCountryName(isoCode: string): string {
  return countries.getName(isoCode, "en", { select: "official" }) || isoCode;
}
