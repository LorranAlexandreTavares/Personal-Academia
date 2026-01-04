
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PhysicalAssessment } from '../types';
import { formatDate } from '../lib/utils';

interface EvolutionChartsProps {
  assessments: PhysicalAssessment[];
}

type ChartMetric = 'composition' | 'measurements' | 'skinfolds';

const EvolutionCharts: React.FC<EvolutionChartsProps> = ({ assessments }) => {
  const [activeMetric, setActiveMetric] = useState<ChartMetric>('composition');
  
  if (assessments.length < 2) {
    return <div className="text-center p-8 text-slate-400">É necessário ter pelo menos duas avaliações para gerar gráficos de evolução.</div>;
  }
  
  const sortedAssessments = [...assessments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const chartData = sortedAssessments.map(a => ({
    date: formatDate(a.date),
    weight: a.weight,
    fatPercentage: a.fatPercentage,
    fatMass: a.fatMass,
    leanMass: a.leanMass,
    ...a.bodyMeasurements,
    ...a.skinfolds
  }));

  const measurementColors = {
      weight: '#38bdf8',
      fatMass: '#f87171',
      leanMass: '#34d399',
      torax: '#fb923c',
      cintura: '#f472b6',
      abdomen: '#a78bfa',
      quadril: '#facc15',
      bracoContraidoDireito: '#60a5fa',
      coxaMedialDireita: '#818cf8',
      panturrilhaDireita: '#a3e635',
      subescapular: '#fb7185',
      tricipital: '#4ade80',
      peitoral: '#c084fc',
      axilarMedia: '#2dd4bf',
      supraIliaca: '#fbbf24',
      abdominal: '#f9a8d4',
      coxa: '#a5b4fc',
  };

  const renderChartLines = () => {
    switch(activeMetric) {
      case 'composition':
        return (
          <>
            <Line type="monotone" dataKey="weight" name="Peso (kg)" stroke={measurementColors.weight} strokeWidth={2} />
            <Line type="monotone" dataKey="fatMass" name="Peso Gordo (kg)" stroke={measurementColors.fatMass} strokeWidth={2} />
            <Line type="monotone" dataKey="leanMass" name="Peso Magro (kg)" stroke={measurementColors.leanMass} strokeWidth={2} />
          </>
        );
      case 'measurements':
        return (
          <>
            <Line type="monotone" dataKey="torax" name="Tórax (cm)" stroke={measurementColors.torax} strokeWidth={2} />
            <Line type="monotone" dataKey="cintura" name="Cintura (cm)" stroke={measurementColors.cintura} strokeWidth={2} />
            <Line type="monotone" dataKey="abdomen" name="Abdômen (cm)" stroke={measurementColors.abdomen} strokeWidth={2} />
            <Line type="monotone" dataKey="quadril" name="Quadril (cm)" stroke={measurementColors.quadril} strokeWidth={2} />
            <Line type="monotone" dataKey="bracoContraidoDireito" name="Braço D. (cm)" stroke={measurementColors.bracoContraidoDireito} strokeWidth={2} />
            <Line type="monotone" dataKey="coxaMedialDireita" name="Coxa D. (cm)" stroke={measurementColors.coxaMedialDireita} strokeWidth={2} />
          </>
        );
      case 'skinfolds':
        return (
          <>
            {Object.keys(assessments[0].skinfolds).map((key) => (
              <Line key={key} type="monotone" dataKey={key} name={`${key} (mm)`} stroke={measurementColors[key as keyof typeof measurementColors] || '#ffffff'} strokeWidth={2} />
            ))}
          </>
        );
      default:
        return null;
    }
  };

  const ChartButton = ({ metric, label }: { metric: ChartMetric, label: string }) => (
    <button
      onClick={() => setActiveMetric(metric)}
      className={`px-4 py-2 rounded-md font-semibold text-sm ${activeMetric === metric ? 'bg-sky-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Gráficos de Evolução</h3>
          <div className="flex gap-2">
            <ChartButton metric="composition" label="Peso e Gordura" />
            <ChartButton metric="measurements" label="Medidas" />
            <ChartButton metric="skinfolds" label="Dobras" />
          </div>
      </div>
      
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
            <Legend />
            {renderChartLines()}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EvolutionCharts;
