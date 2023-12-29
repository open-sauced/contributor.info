import React, { useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import dynamic from "next/dynamic";

const CIResponsiveLine = dynamic(() => import("./CIResponsiveLine"), { ssr: false });

import prCounts from "./prCounts";

type Response =
  | { type: "loading" }
  | { type: "error"; error: Error }
  | { type: "result"; data: DBContributors[]; meta: { itemCount: number } };

interface PaginatedDataResponse {
  readonly data: DBContributors[];
  readonly meta: Meta;
}

const ChildWithSWR = (props: { owner: string; repo: string }) => {
  const { owner, repo } = props;
  const { data, error, mutate } = useSWR<PaginatedDataResponse, Error>(`prs/search?repo=${owner}%2F${repo}`);

  if (!data) {
    return <>Loading...</>;
  }

  const chartData = prCounts(data);

  return (
    <>
      data && <CIResponsiveLine data={chartData.prsPerDay} />
    </>
  );
};

// Is this a React component? Maybe the file should be .tsx? +1
const OwnerRepo = () => {
  const router = useRouter();

  // Keep track of our assumptions about data types coming from `router`
  const owner = router.query["owner"] as string;
  const repo = router.query["repo"] as string;

  if (owner && repo) {
    return <ChildWithSWR owner={owner} repo={repo} />;
  }

  console.warn("No owner or repo:", owner, repo);

  return "Loading...";
};

export default OwnerRepo;
