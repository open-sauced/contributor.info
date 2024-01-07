import { AiOutlinePullRequest } from "react-icons/ai";
import { GoGitMerge, GoGitPullRequestClosed, GoIssueOpened, GoIssueClosed } from "react-icons/go";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

interface StatsCardProps {
  type: "issue" | "pr";
  count: number;
  status: "open" | "closed" | "merged";
  prevMonthCount?: number;
  range?: number;
}
const StatsCard = ({ type, status, count, prevMonthCount, range = 30 }: StatsCardProps) => {
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

  const getRangePreset = (range: number) => {
    switch (range) {
    case 7:
      return "last 7 days";
    case 30:
      return "last Month";
    case 90:
      return "last 3 months";
    }
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
          vs {getRangePreset(range)}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
