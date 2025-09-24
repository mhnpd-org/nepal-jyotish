import {DiamondBhavaChart} from '../components/diamond-chart';
import {exampleBhavaData} from '../components/data'
import { DiamondChartDemo } from '@internal/components/test';



export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen gap-8">

      <DiamondChartDemo size={400} />
    </div>
  );
}
