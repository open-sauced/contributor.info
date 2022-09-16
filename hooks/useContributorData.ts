import useSWR from "swr";
import { useCallback } from "react";

interface PaginatedDataResponse {
  readonly data: DBContributors[];
  readonly meta: Meta;
}

type Response =
  | { type: "loading" }
  | { type: "error"; error: Error }
  // Todo: figure out meta
  | { type: "result"; data: DBContributors[]; meta: { itemCount: number } };

// We're not currently using this, we're just using useSWR directly inside ChildWithSWR
// this needs useCallback wrap if we want to use it in the other component
const useContributorData = () => {
  useCallback(async (owner: string, repo: string): Promise<Response> => {
    console.log(owner);
    // useSWR is probably going to be a sticking point
    const { data, error, mutate } = useSWR<PaginatedDataResponse, Error>(
      `repos/${owner}/${repo}/contributions`
    );

    if (!error && !data) {
      return { type: "loading" };
    }

    if (error) {
      return {
        type: "error",
        error: error
      };
    }

    return {
      type: "result",
      data: data?.data ?? [],
      meta: data?.meta ?? { itemCount: 0 },
      mutate
    };
  }, []);
};
// good catch []

export { useContributorData };
