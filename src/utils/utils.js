export const tierColors = {
  Passing: "#C4C4C4",
  Underperforming: "#FFB042",
  Failing: "#D43C37",
};

export const donorMapColors = nhb_rank => {
  switch (nhb_rank) {
    case nhb_rank < 7.5:
      return "#4E1C19";
    case nhb_rank > 7.5 && nhb_rank < 9.4:
      return "#89322B";
    case nhb_rank > 9.4 && nhb_rank < 11.4:
      return "#D43C37";
    case nhb_rank > 11.4 && nhb_rank < 13.0:
      return "#FFB042";
    case nhb_rank > 13.0 && nhb_rank < 15.4:
      return "#F9D558";
    case nhb_rank > 15.4:
      return "#00768F";
    default:
      return `'Missing Data' + '#C4C4C4'`;
  }
};

export const racialDemographics = {
  race_perf_white: "White",
  race_perf_native: "American Indian/Alaskan Native",
  race_perf_asian: "Asian",
  race_perf_black: "Black",
  race_perf_hispanic: "Hispanic",
  race_perf_islander: "Pacific Islander",
  race_perf_multiracial: "Multiracial",
  race_perf_unkown: "Unknown",
};

export const findStateFeature = (statesGeoData, abbrev) =>
  abbrev
    ? statesGeoData?.childGeoJson?.features?.find(
        ({ properties: { abbreviation } }) => abbreviation === abbrev
      )
    : null;
export const findOpoFeature = (dsaGeoJson, abbr) =>
  abbr
    ? dsaGeoJson?.childGeoJson?.features?.find(
        ({ properties: { opo } }) => opo === abbr
      )
    : null;

export const formatNumber = (num, options) =>
  !num || isNaN(num) ? "--" : num.toLocaleString("en-US", options);

export const formatPercent = percent =>
  !percent || isNaN(percent)
    ? "--"
    : `${percent.toLocaleString("en-US", {
        style: "percent",
        minimumFractionDigits: 2,
      })}`;

export const formatMoney = num => {
  return formatNumber(num, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const formatStateName = ({ abbreviation, name }) =>
  `${name} (${abbreviation.toLocaleUpperCase()})`;

export const formatOpoName = ({ name, opo }) =>
  `${name} (${opo.toUpperCase()})`;

export const formatOPORank = opoDate => 99;
