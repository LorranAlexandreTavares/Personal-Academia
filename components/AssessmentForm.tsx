
import React, { useState, useEffect } from 'react';
import { PhysicalAssessment, BodyMeasurements, Skinfolds, Gender } from '../types';
import { calculateBMI, calculateBodyComposition, getAge } from '../lib/utils';
import { XIcon } from './icons';

interface AssessmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assessment: Omit<PhysicalAssessment, 'id'>) => void;
  height: number;
  gender: Gender;
  birthDate: string;
}

const initialBodyMeasurements: BodyMeasurements = { pescoco: 0, ombro: 0, torax: 0, cintura: 0, abdomen: 0, quadril: 0, bracoRelaxadoDireito: 0, bracoRelaxadoEsquerdo: 0, bracoContraidoDireito: 0, bracoContraidoEsquerdo: 0, antebracoDireito: 0, antebracoEsquerdo: 0, coxaProximalDireita: 0, coxaProximalEsquerda: 0, coxaMedialDireita: 0, coxaMedialEsquerda: 0, coxaDistalDireita: 0, coxaDistalEsquerda: 0, panturrilhaDireita: 0, panturrilhaEsquerda: 0 };
const initialSkinfolds: Skinfolds = { subescapular: 0, tricipital: 0, peitoral: 0, axilarMedia: 0, supraIliaca: 0, abdominal: 0, coxa: 0 };

interface FormInputProps {
    label: string;
    name: string;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    unit: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, name, value, onChange, unit }) => (
  <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-400">{label} ({unit})</label>
      <input type="number" step="0.1" name={name} id={name} value={value} onChange={onChange} className="mt-1 block w-full bg-slate-900 border-slate-600 rounded-md shadow-sm text-white p-2 focus:ring-sky-500 focus:border-sky-500" />
  </div>
);

const CalculatedValue: React.FC<{ label: string; value: string | number; unit?: string }> = ({ label, value, unit }) => (
    <div>
        <label className="block text-sm font-medium text-slate-300">{label}</label>
        <div className="mt-1 block w-full bg-slate-900 border-slate-700 rounded-md shadow-sm text-slate-400 p-2">
            {value} <span className="text-xs">{unit}</span>
        </div>
    </div>
);

const AssessmentForm: React.FC<AssessmentFormProps> = ({ isOpen, onClose, onSave, height: initialHeight, gender, birthDate }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(initialHeight || 0);
  
  const [bmi, setBmi] = useState(0);
  const [fatPercentage, setFatPercentage] = useState(0);
  const [fatMass, setFatMass] = useState(0);
  const [leanMass, setLeanMass] = useState(0);

  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurements>(initialBodyMeasurements);
  const [skinfolds, setSkinfolds] = useState<Skinfolds>(initialSkinfolds);

  useEffect(() => {
    setHeight(initialHeight);
  }, [initialHeight]);

  useEffect(() => {
    const age = getAge(birthDate);
    const newBmi = calculateBMI(weight, height);
    setBmi(newBmi);
    
    const composition = calculateBodyComposition(weight, skinfolds, age, gender);
    setFatPercentage(composition.fatPercentage);
    setFatMass(composition.fatMass);
    setLeanMass(composition.leanMass);
  }, [weight, height, skinfolds, birthDate, gender]);

  const handleBodyMeasurementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBodyMeasurements(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSkinfoldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSkinfolds(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ date, weight, height, bmi, fatPercentage, fatMass, leanMass, bodyMeasurements, skinfolds });
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-5xl relative max-h-[90vh]">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
           <div className="p-6 border-b border-slate-700">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Nova Avaliação Física</h2>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-white"><XIcon /></button>
                </div>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-slate-300">Data</label>
                        <input type="date" name="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm text-white p-2"/>
                    </div>
                     <div>
                        <label htmlFor="weight" className="block text-sm font-medium text-slate-300">Peso (kg)</label>
                        <input type="number" step="0.1" name="weight" id="weight" value={weight} onChange={e => setWeight(parseFloat(e.target.value) || 0)} required className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm text-white p-2"/>
                    </div>
                    <div>
                        <label htmlFor="height" className="block text-sm font-medium text-slate-300">Altura (cm)</label>
                        <input type="number" name="height" id="height" value={height} onChange={e => setHeight(parseFloat(e.target.value) || 0)} required className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm text-white p-2"/>
                    </div>
                </div>

                <div className="bg-slate-700/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-sky-400 mb-4">Composição Corporal (Cálculo Automático)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <CalculatedValue label="IMC" value={bmi} />
                        <CalculatedValue label="% Gordura" value={fatPercentage} unit="%" />
                        <CalculatedValue label="Peso Gordo" value={fatMass} unit="kg" />
                        <CalculatedValue label="Peso Magro" value={leanMass} unit="kg" />
                    </div>
                </div>

                <div className="bg-slate-700/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-sky-400 mb-4">Dobras Cutâneas (mm)</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
                        <FormInput label="Subescapular" name="subescapular" value={skinfolds.subescapular} onChange={handleSkinfoldChange} unit="mm" />
                        <FormInput label="Tricipital" name="tricipital" value={skinfolds.tricipital} onChange={handleSkinfoldChange} unit="mm" />
                        <FormInput label="Peitoral" name="peitoral" value={skinfolds.peitoral} onChange={handleSkinfoldChange} unit="mm" />
                        <FormInput label="Axilar Média" name="axilarMedia" value={skinfolds.axilarMedia} onChange={handleSkinfoldChange} unit="mm" />
                        <FormInput label="Supra-ilíaca" name="supraIliaca" value={skinfolds.supraIliaca} onChange={handleSkinfoldChange} unit="mm" />
                        <FormInput label="Abdominal" name="abdominal" value={skinfolds.abdominal} onChange={handleSkinfoldChange} unit="mm" />
                        <FormInput label="Coxa" name="coxa" value={skinfolds.coxa} onChange={handleSkinfoldChange} unit="mm" />
                    </div>
                </div>
                
                <div className="bg-slate-700/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-sky-400 mb-4">Medidas Corporais (cm)</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-slate-300 mb-2">Tronco</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                          <FormInput label="Pescoço" name="pescoco" value={bodyMeasurements.pescoco} onChange={handleBodyMeasurementChange} unit="cm" />
                          <FormInput label="Ombro" name="ombro" value={bodyMeasurements.ombro} onChange={handleBodyMeasurementChange} unit="cm" />
                          <FormInput label="Tórax" name="torax" value={bodyMeasurements.torax} onChange={handleBodyMeasurementChange} unit="cm" />
                          <FormInput label="Cintura" name="cintura" value={bodyMeasurements.cintura} onChange={handleBodyMeasurementChange} unit="cm" />
                          <FormInput label="Abdômen" name="abdomen" value={bodyMeasurements.abdomen} onChange={handleBodyMeasurementChange} unit="cm" />
                          <FormInput label="Quadril" name="quadril" value={bodyMeasurements.quadril} onChange={handleBodyMeasurementChange} unit="cm" />
                        </div>
                      </div>
                      <div className="border-t border-slate-600 pt-4">
                        <h4 className="font-medium text-slate-300 mb-2">Membros Superiores</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                           <FormInput label="Braço Relaxado D." name="bracoRelaxadoDireito" value={bodyMeasurements.bracoRelaxadoDireito} onChange={handleBodyMeasurementChange} unit="cm" />
                           <FormInput label="Braço Relaxado E." name="bracoRelaxadoEsquerdo" value={bodyMeasurements.bracoRelaxadoEsquerdo} onChange={handleBodyMeasurementChange} unit="cm" />
                           <FormInput label="Braço Contraído D." name="bracoContraidoDireito" value={bodyMeasurements.bracoContraidoDireito} onChange={handleBodyMeasurementChange} unit="cm" />
                           <FormInput label="Braço Contraído E." name="bracoContraidoEsquerdo" value={bodyMeasurements.bracoContraidoEsquerdo} onChange={handleBodyMeasurementChange} unit="cm" />
                           <FormInput label="Antebraço D." name="antebracoDireito" value={bodyMeasurements.antebracoDireito} onChange={handleBodyMeasurementChange} unit="cm" />
                           <FormInput label="Antebraço E." name="antebracoEsquerdo" value={bodyMeasurements.antebracoEsquerdo} onChange={handleBodyMeasurementChange} unit="cm" />
                        </div>
                      </div>
                      <div className="border-t border-slate-600 pt-4">
                        <h4 className="font-medium text-slate-300 mb-2">Membros Inferiores</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
                           <FormInput label="Coxa Proximal D." name="coxaProximalDireita" value={bodyMeasurements.coxaProximalDireita} onChange={handleBodyMeasurementChange} unit="cm" />
                           <FormInput label="Coxa Proximal E." name="coxaProximalEsquerda" value={bodyMeasurements.coxaProximalEsquerda} onChange={handleBodyMeasurementChange} unit="cm" />
                           <FormInput label="Coxa Medial D." name="coxaMedialDireita" value={bodyMeasurements.coxaMedialDireita} onChange={handleBodyMeasurementChange} unit="cm" />
                           <FormInput label="Coxa Medial E." name="coxaMedialEsquerda" value={bodyMeasurements.coxaMedialEsquerda} onChange={handleBodyMeasurementChange} unit="cm" />
                           <FormInput label="Coxa Distal D." name="coxaDistalDireita" value={bodyMeasurements.coxaDistalDireita} onChange={handleBodyMeasurementChange} unit="cm" />
                           <FormInput label="Coxa Distal E." name="coxaDistalEsquerda" value={bodyMeasurements.coxaDistalEsquerda} onChange={handleBodyMeasurementChange} unit="cm" />
                           <FormInput label="Panturrilha D." name="panturrilhaDireita" value={bodyMeasurements.panturrilhaDireita} onChange={handleBodyMeasurementChange} unit="cm" />
                           <FormInput label="Panturrilha E." name="panturrilhaEsquerda" value={bodyMeasurements.panturrilhaEsquerda} onChange={handleBodyMeasurementChange} unit="cm" />
                        </div>
                      </div>
                    </div>
                </div>
            </div>
          
            <div className="flex justify-end gap-4 mt-auto p-6 border-t border-slate-700">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg">Salvar Avaliação</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AssessmentForm;
