import useSWR from "swr";

interface PaginatedDataResponse {
  readonly data: DBContributors[];
  readonly meta: Meta;
}

const useContributorData = (owner: string, repo: string) => {
  const { data, error, mutate } = useSWR<PaginatedDataResponse, Error>(`repos/${owner}/${repo}/contributions`);

  return {
    data: data?.data ?? [],
    meta: data?.meta ?? { itemCount: 0 },
    isLoading: !error && !data,
    isError: !!error,
    mutate
  };
};

export {useContributorData};