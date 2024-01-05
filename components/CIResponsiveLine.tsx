import { ResponsiveLine, Datum } from "@nivo/line";
import { format, parse } from "date-fns";

const CIResponsiveLine = ({ data }: Datum) => {
  return (
    <>
      <div style={{ height: 400, width: "100%" }}>
        <ResponsiveLine
          data={data}
          margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
          yScale={{
            type: "linear",
          }}
          motionConfig="stiff"
          curve="catmullRom"
          enableSlices="x"
          axisTop={null}
          isInteractive={true}
          axisRight={null}
          axisLeft={{
            tickValues: 5,
            tickSize: 0,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Pull Requests Merged per Day",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          axisBottom={{
            tickSize: 0,
            format: (value) => {
              return format(parse(value, "dd/MM/yyyy", new Date()), "MMM d");
            },
          }}
          pointSize={0}
          pointColor={{ theme: "background" }}
          enableGridX={false}
          enableGridY={false}
          useMesh={true}
          enableArea={false}
          enableCrosshair={true}
          enablePointLabel={false}
          colors={(d) => d.color}
        />
      </div>
    </>
  );
};

export default CIResponsiveLine;
