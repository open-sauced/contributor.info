import React from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const CIResponsiveLine = dynamic(() => import("components/CIResponsiveLine"), { ssr: false });

import prPerDay from "lib/prCounts";
import { useContributorData } from "hooks/useContributorData";
import { GetServerSidePropsContext } from "next";
import DateFilter from "components/primitives/DateFilter";
import StatsCard from "components/StatsCard";
import DataLabel from "components/primitives/DataLabel";

export interface PaginatedDataResponse {
  readonly data: DBContributorsPR[];
  readonly meta: Meta;
}

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
  const range = router.query["range"] as string;

  const { data: openedPrs, meta: openedPrsMeta } = useContributorData({
    repo: `${owner}/${repo}`,
    status: "open",
    initialData: currentOpenPrs,
    range: Number(range ?? 30),
  });
  const { data: prevMonthOpenedPrs, meta: prevMonthOpenedPrsMeta } = useContributorData({
    repo: `${owner}/${repo}`,
    startDate: Number(range ?? 30),
    status: "open",
    initialData: prevOpenPrs,
  });

  const { data: closedPrs } = useContributorData({
    repo: `${owner}/${repo}`,
    status: "closed",
    initialData: currentClosedPrs,
    range: Number(range ?? 30),
  });
  const { data: prevMonthClosedPrs, meta: prevMonthClosedPrsMeta } = useContributorData({
    repo: `${owner}/${repo}`,
    startDate: Number(range ?? 30),
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
              range={Number(range ?? 30)}
              count={openedPrsMeta.itemCount}
              prevMonthCount={prevMonthOpenedPrs ? prevMonthOpenedPrsMeta.itemCount : undefined}
            />
            <StatsCard
              type="pr"
              status="merged"
              range={Number(range ?? 30)}
              count={closedPrs.filter((pr) => pr.pr_is_merged === true).length}
              prevMonthCount={prevMonthClosedPrs ? prevMonthClosedPrsMeta.itemCount : undefined}
            />
            <StatsCard
              type="pr"
              status="closed"
              range={Number(range ?? 30)}
              count={closedPrs.filter((item) => item.pr_state === "close" && !item.pr_is_merged).length}
              prevMonthCount={prevMonthClosedPrsMeta ? prevMonthClosedPrsMeta.itemCount : undefined}
            />
          </div>
          <div className="mt-6">
            <DateFilter
              setRangeFilter={(value) => {
                router.push({
                  pathname: router.pathname,
                  query: { ...router.query, range: value },
                });
              }}
              defaultRange={Number(range ?? 30)}
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
