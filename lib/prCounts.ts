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

const prPerDay = (open: DBContributorsPR[], closed: DBContributorsPR[]) => {
  const sortedMergedPRs = closed.sort((a, b) => {
    const aDate = new Date(a.pr_closed_at);
    const bDate = new Date(b.pr_closed_at);

    return aDate.getTime() - bDate.getTime();
  });

  const sortedOpenedPRs = open.sort((a, b) => {
    const aDate = new Date(a.pr_closed_at);
    const bDate = new Date(b.pr_closed_at);

    return aDate.getTime() - bDate.getTime();
  });
  const mergedPRsPerDay = sortedMergedPRs.reduce<Record<string, number>>((acc, item) => {
    const mergedDate = new Date(item.pr_merged_at).toLocaleDateString();

    if (item.pr_is_merged) {
      if (!acc[mergedDate]) {
        acc[mergedDate] = 0;
      }
      acc[mergedDate]++;
    }

    return acc;
  }, {});

  const closedPRsPerDay = sortedMergedPRs.reduce<Record<string, number>>((acc, item) => {
    const closedDate = new Date(item.pr_updated_at).toLocaleDateString();

    if (item.pr_is_merged === false) {
      if (!acc[closedDate]) {
        acc[closedDate] = 0;
      }
      acc[closedDate]++;
    }

    return acc;
  }, {});

  const openedPRsPerDay = sortedOpenedPRs.reduce<Record<string, number>>((acc, item) => {
    const openedDate = new Date(item.pr_created_at).toLocaleDateString();

    if (!acc[openedDate]) {
      acc[openedDate] = 0;
    }
    acc[openedDate]++;

    return acc;
  }, {});

  const openedPRs = Object.entries(openedPRsPerDay).map(([x, y]) => ({ x, y }));
  const closedPRs = Object.entries(closedPRsPerDay).map(([x, y]) => ({ x, y }));

  const mergedPrs = Object.entries(mergedPRsPerDay).map(([x, y]) => ({ x, y }));

  return [
    {
      id: "Opened PRs",
      color: "#10b981",
      data: openedPRs.reverse(),
    },
    {
      id: "Merged PRs",
      color: "#3b38f1",
      data: mergedPrs.reverse(),
    },
    {
      id: "Closed PRs",
      color: "#ef4444",
      data: closedPRs.reverse(),
    },
  ];
};

export default prPerDay;
