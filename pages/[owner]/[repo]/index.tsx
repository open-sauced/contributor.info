import React from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import dynamic from "next/dynamic";

import { AiOutlinePullRequest } from "react-icons/ai";
import { GoGitMerge, GoGitPullRequestClosed, GoIssueOpened, GoIssueClosed } from "react-icons/go";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

const CIResponsiveLine = dynamic(() => import("./CIResponsiveLine"), { ssr: false });

import prCounts from "./prCounts";

export interface PaginatedDataResponse {
  readonly data: DBContributorsPR[];
  readonly meta: Meta;
}

interface StatsCardProps {
  type: "issue" | "pr";
  count: number;
  status: "open" | "closed" | "merged";
  prevMonthCount?: number;
}
const ChildWithSWR = (props: { owner: string; repo: string }) => {
  const { owner, repo } = props;
  const { data, error, mutate } = useSWR<PaginatedDataResponse, Error>(`prs/search?repo=${owner}%2F${repo}`);
  // fetch previous months data seperately to compare
  const {
    data: prevMonthData,
    error: prevMonthError,
    mutate: prevMonthMutate,
  } = useSWR<PaginatedDataResponse, Error>(`prs/search?repo=${owner}%2F${repo}&prev_days_start_date=30`);

  if (!data && !error) {
    return <>Loading...</>;
  }

  const chartData = prCounts(data!.data);

  const getPercentageChange = (prevCount: number, currentCount: number) => {
    const percentageChange = ((currentCount - prevCount) / prevCount) * 100;
    return percentageChange;
  };

  const StatsCard = ({ type, status, count, prevMonthCount }: StatsCardProps) => {
    const IconMap = {
      issue: {
        open: <GoIssueOpened />,
        closed: <GoIssueClosed />,
        merged: <GoGitMerge />,
      },
      pr: {
        open: <AiOutlinePullRequest />,
        closed: <GoGitPullRequestClosed />,
        merged: <GoGitMerge />,
      },
    };

    return (
      <div className="bg-white border shadow rounded-lg p-4 pb-6 flex flex-col gap-4 text-slate-800 min-w-[340px]">
        <div
          className={`border p-3 rounded-md w-max ${
            status === "open" ? "text-green-500" : status === "closed" ? "text-red-500" : "text-violet-400"
          }`}
        >
          {IconMap[type][status]}
        </div>
        <div className="capitalize text-gray-500 text-sm">
          Pull Requests {status === "merged" || status === "closed" ? status : null}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-semibold">{count}</span>
          <div className="flex items-center gap-1">
            {getPercentageChange(prevMonthCount!, count) >= 0 ? (
              <FaArrowTrendUp className="text-green-700" />
            ) : (
              <FaArrowTrendDown className="text-red-700" />
            )}
            <span className={`${getPercentageChange(prevMonthCount!, count) >= 0 ? "text-green-700" : "text-red-700"}`}>
              {getPercentageChange(prevMonthCount!, count).toFixed(2)}%
            </span>{" "}
            vs last month
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white h-screen flex justify-center items-center w-full flex-col px-8">
      <div className="w-max flex gap-3 mr-auto flex-wrap">
        <StatsCard
          type="pr"
          status="open"
          count={chartData.meta.totalCount}
          prevMonthCount={prevMonthData ? prCounts(prevMonthData!.data).meta.totalCount : undefined}
        />
        <StatsCard
          type="pr"
          status="merged"
          count={chartData.meta.mergedCount}
          prevMonthCount={prevMonthData ? prCounts(prevMonthData!.data).meta.mergedCount : undefined}
        />
        <StatsCard
          type="pr"
          status="closed"
          count={chartData.meta.closedCount}
          prevMonthCount={prevMonthData ? prCounts(prevMonthData!.data).meta.closedCount : undefined}
        />
      </div>

      <CIResponsiveLine data={chartData.prsPerDay} />

      <div className="flex justify-center gap-4 flex-wrap"></div>
    </div>
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
