import NorthDrekkanaChart from '@internal/components/north-drekkana-chart';



export default function Home() {
  const SAMPLE_HOUSES = {
    1: { rashi: "Mesha", grahas: [] },
    2: { rashi: "Vrishabha", grahas: ["Mars"] },
    3: { rashi: "Mithuna", grahas: [] },
    4: { rashi: "Karka", grahas: ["Jupiter", "Ketu"] },
    5: { rashi: "Simha", grahas: ["Sun", "Mercury", "Venus"] },
    6: { rashi: "Kanya", grahas: [] },
    7: { rashi: "Tula", grahas: ["Moon"] },
    8: { rashi: "Vrishchika", grahas: [] },
    9: { rashi: "Dhanus", grahas: ["Saturn"] },
    10: { rashi: "Makara", grahas: ["Rahu"] },
    11: { rashi: "Kumbha", grahas: [] },
    12: { rashi: "Meena", grahas: [] },
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <NorthDrekkanaChart
        lagna={258.72}
        houses={SAMPLE_HOUSES}
        size={420}
        title="Demo Lagna Chart (Normal Mode)"
      />
      
      <NorthDrekkanaChart
        lagna={258.72}
        houses={SAMPLE_HOUSES}
        size={420}
        title="Demo Lagna Chart (Debug Mode)"
        debug={true}
      />
    </div>
  );
}
