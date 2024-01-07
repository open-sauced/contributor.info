import { useState } from "react";

interface DateFilterProps {
  setRangeFilter: (range: number) => void;
  defaultRange?: number;
}

const DateFilter = ({ setRangeFilter, defaultRange }: DateFilterProps) => {
  const [activeFilter, setActiveFilter] = useState<number>(defaultRange ?? 30);
  const dates = [7, 30, 90];

  const rangeFormatter = (value: number) => {
    return value === 7 ? "7d" : value === 30 ? "30d" : "3m";
  };
  const handleFilterClick = (range: number) => {
    setActiveFilter(range);
    setRangeFilter(range);
  };

  return (
    <div className="flex items-center text-sm bg-white rounded-lg shrink-0 w-max border">
      {dates.map((range, index) => (
        <button
          onClick={() => handleFilterClick(range)}
          className={`px-4 py-1.5 rounded-lg cursor-pointer transition text-light-slate-9 ${
            activeFilter === range && "border text-slate-700 bg-slate-200"
          }`}
          key={index}
        >
          {rangeFormatter(range)}
        </button>
      ))}
    </div>
  );
};

export default DateFilter;
