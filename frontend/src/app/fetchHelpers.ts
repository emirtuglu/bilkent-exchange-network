import { urls } from "../data-types/constants.ts";
import { FilterParams } from "../data-types/datatypes.ts";

export default function prepareUrl(
  searchTerm: string,
  type: string,
  filterParams?: FilterParams
) {
  let url: string = urls[type as keyof typeof urls];
  if (filterParams) {
    if (type !== "sectionexchange") {
      if (filterParams.categories.length > 0) {
        url = url.replace(":categories", filterParams.categories.join(","));
      } else {
        url = url.replace(":categories", "All");
      }
    }

    if (type === "secondhand" || type === "sectionexchange") {
      if (filterParams.prices.min && filterParams.prices.max) {
        url = url.replace(
          ":price",
          filterParams.prices.min + "*" + filterParams.prices.max
        );
      } else if (filterParams.prices.min) {
        url = url.replace(":price", filterParams.prices.min + "*" + "All");
      } else if (filterParams.prices.max) {
        url = url.replace(":price", "All" + "*" + filterParams.prices.max);
      } else {
        url = url.replace(":price", "All");
      }
    }

    if (type === "sectionexchange") {
      url = url.replace(":offeredCourse", filterParams.offeredCourse);
      url = url.replace(":desiredCourse", filterParams.desiredCourse);
      url = url.replace(":offeredSection", String(filterParams.offeredSection));
      url = url.replace(":desiredSection", String(filterParams.desiredSection));
    }

    if (type === "lostfound") {
      url = url.replace(":status", filterParams.status);
    }

    if (filterParams.dates.startDate && filterParams.dates.endDate) {
      url = url.replace(
        ":date",
        filterParams.dates.startDate.toISOString() +
          "*" +
          filterParams.dates.endDate.toISOString()
      );
    } else if (filterParams.dates.startDate) {
      url = url.replace(
        ":date",
        filterParams.dates.startDate.toISOString() + "*" + "All"
      );
    } else if (filterParams.dates.endDate) {
      url = url.replace(
        ":date",
        "All" + "*" + filterParams.dates.endDate.toISOString()
      );
    } else {
      url = url.replace(":date", "All");
    }
  }

  if (searchTerm) {
    url = url.replace(":search", searchTerm);
  } else {
    url = url.replace(":search", "All");
  }

  return url;
}
