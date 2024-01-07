interface DataLabelProps {
  label: string;
  type: "merged" | "closed" | "open";
}

const DataLabel = ({ label, type }: DataLabelProps) => {
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

export default DataLabel;
