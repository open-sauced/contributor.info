
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

export default count;
