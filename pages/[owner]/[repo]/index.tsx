import React from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import { AiOutlinePullRequest } from "react-icons/ai";
import { GoGitMerge, GoGitPullRequestClosed, GoIssueOpened, GoIssueClosed } from "react-icons/go";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

const CIResponsiveLine = dynamic(() => import("components/CIResponsiveLine"), { ssr: false });

import prPerDay from "lib/prCounts";
import { useContributorData } from "hooks/useContributorData";
import { GetServerSidePropsContext } from "next";

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
  const getPercentageChange = (prevCount: number, currentCount: number) => {
    const percentageChange = Math.abs((currentCount - prevCount) / prevCount) * 100;
    return percentageChange;
  };

  return (
    <div className="bg-white border shadow rounded-lg p-4 pb-6 flex flex-col gap-4 text-slate-800 w-full md:w-[340px] ">
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

const DataLabel = ({ label, type }: { label: string; type: "merged" | "closed" | "open" }) => {
  const getColorByType = (type: string) => {
    switch (type) {
    case "merged":
      return "bg-violet-400";
    case "closed":
      return "bg-red-500";
    case "open":
      return "bg-green-500";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`p-1 rounded-full ${getColorByType(type)}`}></span>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
};

const OwnerRepo = ({
  currentOpenPrs,
  prevOpenPrs,
  currentClosedPrs,
  prevClosedPrs,
}: {
  currentOpenPrs: PaginatedDataResponse;
  prevOpenPrs: PaginatedDataResponse;
  currentClosedPrs: PaginatedDataResponse;
  prevClosedPrs: PaginatedDataResponse;
}) => {
  const router = useRouter();

  const owner = router.query["owner"] as string;
  const repo = router.query["repo"] as string;

  const { data: openedPrs, meta: openedPrsMeta } = useContributorData({
    repo: `${owner}/${repo}`,
    status: "open",
    initialData: currentOpenPrs,
  });
  const { data: prevMonthOpenedPrs, meta: prevMonthOpenedPrsMeta } = useContributorData({
    repo: `${owner}/${repo}`,
    startDate: 30,
    status: "open",
    initialData: prevOpenPrs,
  });

  const { data: closedPrs } = useContributorData({
    repo: `${owner}/${repo}`,
    status: "closed",
    initialData: currentClosedPrs,
  });
  const { data: prevMonthClosedPrs, meta: prevMonthClosedPrsMeta } = useContributorData({
    repo: `${owner}/${repo}`,
    startDate: 30,
    status: "closed",
    initialData: prevClosedPrs,
  });

  if (owner && repo) {
    const chartData = prPerDay(openedPrs, closedPrs);

    return (
      <div className="bg-white">
        <div className="min-h-screen flex pt-20 w-full container flex-col text-black">
          <div className="flex gap-3 mr-auto flex-wrap">
            <StatsCard
              type="pr"
              status="open"
              count={openedPrsMeta.itemCount}
              prevMonthCount={prevMonthOpenedPrs ? prevMonthOpenedPrsMeta.itemCount : undefined}
            />
            <StatsCard
              type="pr"
              status="merged"
              count={closedPrs.filter((pr) => pr.pr_is_merged === true).length}
              prevMonthCount={prevMonthClosedPrs ? prevMonthClosedPrsMeta.itemCount : undefined}
            />
            <StatsCard
              type="pr"
              status="closed"
              count={closedPrs.filter((item) => item.pr_state === "close" && !item.pr_is_merged).length}
              prevMonthCount={prevMonthClosedPrsMeta ? prevMonthClosedPrsMeta.itemCount : undefined}
            />
          </div>

          <CIResponsiveLine data={chartData} />

          <div className="flex gap-4 flex-wrap mt-3 pl-5">
            <DataLabel label="Pull Requests" type="open" />
            <DataLabel label="Pull Requests Merged" type="merged" />
            <DataLabel label="Pull Requests Closed" type="closed" />
          </div>
        </div>
      </div>
    );
  }

  console.warn("No owner or repo:", owner, repo);

  return "Loading...";
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { owner, repo } = ctx.params as { owner: string; repo: string };

  if (!owner || !repo) {
    return {
      notFound: true,
    };
  }

  const [currentOpenData, prevOpenData, currentClosedData, prevClosedData] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_V2_API_URL}/prs/search?repo=${owner}/${repo}&limit=100&state=open`, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    }),
    fetch(`${process.env.NEXT_PUBLIC_V2_API_URL}/prs/search?repo=${owner}/${repo}&prev_days_start_date=30&state=open`, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    }),
    fetch(`${process.env.NEXT_PUBLIC_V2_API_URL}/prs/search?repo=${owner}/${repo}&limit=100&state=closed`, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    }),
    fetch(
      `${process.env.NEXT_PUBLIC_V2_API_URL}/prs/search?repo=${owner}/${repo}&prev_days_start_date=30&state=closed`,
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    ),
  ]);

  if (!currentOpenData.ok || !currentOpenData.ok) {
    return {
      notFound: true,
    };
  }

  const [currentOpenDataJson, prevOpenDataJson, currentClosedDataJson, prevClosedDataJson] = await Promise.all([
    currentOpenData.json(),
    prevOpenData.json(),
    currentClosedData.json(),
    prevClosedData.json(),
  ]);

  return {
    props: {
      currentOpenPrs: currentOpenDataJson as PaginatedDataResponse,
      prevOpenPrs: prevOpenDataJson as PaginatedDataResponse,
      currentClosedPrs: currentClosedDataJson as PaginatedDataResponse,
      prevClosedPrs: prevClosedDataJson as PaginatedDataResponse,
    },
  };
}

export default OwnerRepo;
