import { PaginatedDataResponse } from ".";

const prCounts = (prData: DBContributorsPR[]) => {
  const meta = count(prData);
  const prsPerDay = prPerDay(prData);

  return {
    meta,
    prsPerDay,
  };
};

const count = (prData: DBContributorsPR[]): { mergedCount: number; closedCount: number; totalCount: number } => {
  const mergedCount = prData.filter((item) => item.pr_is_merged).length; // Merged PRs
  const closedCount = prData.filter((item) => item.pr_state === "closed").length; // Closed PRs

  const totalCount = prData.length; // Total number of PRs

  return {
    mergedCount,
    closedCount,
    totalCount,
  };
};

const prPerDay = (prData: DBContributorsPR[]) => {
  const sortedPRs = prData.sort((a, b) => {
    const aDate = new Date(a.pr_created_at);
    const bDate = new Date(b.pr_created_at);

    return aDate.getTime() - bDate.getTime();
  });
  const mergedPRsPerDay = sortedPRs.reduce<Record<string, number>>((acc, item) => {
    const mergedDate = new Date(item.pr_merged_at).toLocaleDateString();

    if (item.pr_is_merged && item.pr_merged_at !== "0001-01-01T00:00:00.000Z") {
      if (!acc[mergedDate]) {
        acc[mergedDate] = 0;
      }
      acc[mergedDate]++;
    }

    return acc;
  }, {});

  const closedPRsPerDay = sortedPRs.reduce<Record<string, number>>((acc, item) => {
    const closedDate = new Date(item.pr_updated_at).toLocaleDateString();

    if (item.pr_state === "closed") {
      if (!acc[closedDate]) {
        acc[closedDate] = 0;
      }
      acc[closedDate]++;
    }

    return acc;
  }, {});

  const openedPRsPerDay = sortedPRs.reduce<Record<string, number>>((acc, item) => {
    const openedDate = new Date(item.pr_created_at).toLocaleDateString();

    if (item.pr_state === "open") {
      if (!acc[openedDate]) {
        acc[openedDate] = 0;
      }
      acc[openedDate]++;
    }

    return acc;
  }, {});

  const openedPRs = Object.entries(openedPRsPerDay).map(([x, y]) => ({ x, y }));
  const closedPRs = Object.entries(closedPRsPerDay).map(([x, y]) => ({ x, y }));

  const mergedPrs = Object.entries(mergedPRsPerDay).map(([x, y]) => ({ x, y }));

  console.log("Merged PRs per day:", mergedPrs);

  return [
    {
      id: "Opened PRs",
      color: "#10b981",
      data: openedPRs,
    },
    {
      id: "Pull Requests",
      color: "#f59e0b",
      data: mergedPrs,
    },
    {
      id: "Closed PRs",
      color: "#ef4444",
      data: closedPRs,
    },
  ];
};

export default prCounts;
