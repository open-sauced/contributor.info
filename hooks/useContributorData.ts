import useSWR, { Fetcher } from "swr";
import { useCallback } from "react";
import apiFetcher from "./useSWR";
interface PaginatedDataResponse {
  readonly data: DBContributorsPR[];
  readonly meta: Meta;
}

type query = {
  repo: string;
  limit?: number;
  startDate?: number;
  status?: "closed" | "open";
  initialData?: PaginatedDataResponse;
  range?: number;
};

// We're not currently using this, we're just using useSWR directly inside ChildWithSWR
// this needs useCallback wrap if we want to use it in the other component
const useContributorData = ({ repo, startDate, status, limit, initialData, range = 30 }: query) => {
  const query = new URLSearchParams();

  if (startDate) {
    query.set("prev_days_start_date", `${startDate}`);
  }
  if (status) {
    query.set("status", `${status}`);
  }
  query.set("repo", `${repo}`);

  query.set("range", `${range}`);

  query.set("limit", "100");

  const baseEndpoint = "prs/search";

  const endpointString = `${baseEndpoint}?${query.toString()}`;

  const { data, error, mutate } = useSWR<PaginatedDataResponse, Error>(
    repo ? endpointString : null,
    apiFetcher as Fetcher<PaginatedDataResponse, Error>,
    { fallbackData: initialData }
  );

  return {
    data: data?.data ?? [],
    isLoading: !data && !error,
    isError: Object.keys(error ?? {}).length > 0,
    meta: data?.meta ?? { itemCount: 0 },
    mutate,
  };
};

export { useContributorData };
