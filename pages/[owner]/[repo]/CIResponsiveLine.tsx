import { ResponsiveLine, Datum } from "@nivo/line";

const CIResponsiveLine = ({ data }: Datum) => {
  return (
    <>
      <div style={{ height: 400, width: "100%" }}>
        <ResponsiveLine
          data={data}
          margin={{ top: 50, right: 150, bottom: 50, left: 60 }}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: true,
            reverse: false,
          }}
          curve="monotoneX"
          yFormat=" >-.2f"
          axisTop={null}
          axisRight={null}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Pull Requests Merged per Day",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          pointSize={0}
          pointColor={{ theme: "background" }}
          enableGridX={false}
          enableGridY={false}
          useMesh={true}
          enableArea={false}
          // legends={[]}
          enableCrosshair={false}
        />
      </div>
    </>
  );
};

export default CIResponsiveLine;
