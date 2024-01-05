import useSWR from "swr";
import { useCallback } from "react";
interface PaginatedDataResponse {
  readonly data: DBContributorsPR[];
  readonly meta: Meta;
}

// We're not currently using this, we're just using useSWR directly inside ChildWithSWR
// this needs useCallback wrap if we want to use it in the other component
const useContributorData = (repo: string, startDate?: number, status?: "closed" | "open") => {
  const query = new URLSearchParams();

  if (startDate) {
    query.set("prev_days_start_date", `${startDate}`);
  }
  if (status) {
    query.set("status", `${status}`);
  }
  query.set("repo", `${repo}`);

  query.set("limit", "100");

  const baseEndpoint = "prs/search";

  const endpointString = `${baseEndpoint}?${query.toString()}`;

  const { data, error, mutate } = useSWR<PaginatedDataResponse, Error>(repo ? endpointString : null);

  return {
    data: data?.data ?? [],
    isLoading: !data && !error,
    isError: Object.keys(error ?? {}).length > 0,
    meta: data?.meta ?? { itemCount: 0 },
    mutate,
  };
};

export { useContributorData };
