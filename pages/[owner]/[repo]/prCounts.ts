
const prCounts = (prData) => {
  const meta = count(prData);
  const prsPerDay = prPerDay(prData);

  return {
    meta,
    prsPerDay
  };
};

const count = (prData): { mergedCount: number; closedCount: number; totalCount: number } => {
  let mergedCount = 0;
  let closedCount = 0;

  prData.data.forEach((item) => {
    if (item.pr_is_merged === true) {
      mergedCount++; // Increment merged PR count
    }

    if (item.pr_state === "closed") {
      closedCount++; // Increment closed PR count
    }
  });

  const totalCount = prData.data.length; // Total number of PRs

  console.log("Merged PRs:", mergedCount);
  console.log("Closed PRs:", closedCount);
  console.log("Total PRs:", totalCount);

  return {
    mergedCount,
    closedCount,
    totalCount
  };
};

const prPerDay = (prData) => {
  const mergedPRsPerDay = {};

  prData.data.forEach((item) => {
    const mergedDate = new Date(item.pr_merged_at).toLocaleDateString();

    if (item.pr_is_merged === true && item.pr_merged_at !== "0001-01-01T00:00:00.000Z") {
      if (!mergedPRsPerDay[mergedDate]) {
        mergedPRsPerDay[mergedDate] = 0;
      }
      mergedPRsPerDay[mergedDate]++;
    }
  });

  const transformedData = Object.entries(mergedPRsPerDay).map(([x, y]) => ({ id: x, x, y }));

  console.log("Merged PRs per day:", transformedData);

  return {
    id: "perDay",
    color: "#f59e0b",
    data: transformedData,
  };

};

export default prCounts;
