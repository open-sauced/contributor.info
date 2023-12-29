import { ResponsiveLine } from "@nivo/line";

interface CIResponsiveLineProps {
  data?: CIResponsiveLinePropseDatum[];
}

const CIResponsiveLine = ({ data = [] }: CIResponsiveLineProps) => {
  return (
    <>
      <ResponsiveLine data={data} />
    </>
  );
};

export default CIResponsiveLine;
