
const prCounts = async (prData) => {
  const meta = await count(prData);
  const prsPerDay = await prPerDay(prData);

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
  // Create an object to store merged PRs per day
  const mergedPRsPerDay = {};

  prData.data.forEach((item) => {
    const mergedDate = new Date(item.pr_merged_at).toLocaleDateString(); // Extracting the date

    if (item.pr_is_merged === true && item.pr_merged_at !== "0001-01-01T00:00:00.000Z") {
      if (!mergedPRsPerDay[mergedDate]) {
        mergedPRsPerDay[mergedDate] = 0; // Initialize count for the day if it doesn't exist
      }
      mergedPRsPerDay[mergedDate]++; // Increment merged PR count for that day
    }
  });

  console.log("Merged PRs per day:", mergedPRsPerDay);

  return mergedPRsPerDay;
}

export default prCounts;
