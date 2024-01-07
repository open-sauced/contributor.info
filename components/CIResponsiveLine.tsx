import { ResponsiveLine, Datum } from "@nivo/line";
import { useRouter } from "next/router";

const CIResponsiveLine = ({ data }: Datum) => {
  const router = useRouter();
  const { range = 30 } = router.query;
  return (
    <>
      <div style={{ height: 400, width: "100%" }}>
        <ResponsiveLine
          data={data}
          margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
          yScale={{
            type: "linear",
            stacked: true,
          }}
          xScale={{ type: "time", format: "%m/%d/%Y", precision: "day" }}
          motionConfig="stiff"
          curve="basis"
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
          xFormat="time:%m/%d/%Y"
          axisBottom={{
            format: "%b %d",
            tickValues: `every ${Number(range) > 7 ? 5 : 1} day`,
          }}
          theme={{
            axis: {},
            grid: {
              line: {
                strokeDasharray: "4 4",
                strokeWidth: 1,
                strokeOpacity: 0.7,
              },
            },
          }}
          pointSize={0}
          pointColor={{ theme: "background" }}
          enableGridX={false}
          enableGridY={false}
          useMesh={true}
          enableArea={false}
          enablePointLabel={false}
          colors={(d) => d.color}
        />
      </div>
    </>
  );
};

export default CIResponsiveLine;
