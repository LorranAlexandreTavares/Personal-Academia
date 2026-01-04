
import React, { useState } from 'react';
import { WorkoutPlan, WorkoutDay, Exercise } from '../types';
import { XIcon, PlusIcon, TrashIcon } from './icons';

interface WorkoutPlanFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Omit<WorkoutPlan, 'id'>) => void;
}

const workoutNames = ['A', 'B', 'C', 'D', 'E', 'F'];

const WorkoutPlanForm: React.FC<WorkoutPlanFormProps> = ({ isOpen, onClose, onSave }) => {
  const [trainingDays, setTrainingDays] = useState(3);
  const [workouts, setWorkouts] = useState<WorkoutDay[]>([]);

  const handleDaysChange = (days: number) => {
    setTrainingDays(days);
    const newWorkouts: WorkoutDay[] = Array.from({ length: days }, (_, i) => ({
      id: `workout-${i}`,
      name: `Treino ${workoutNames[i]}`,
      musclesWorked: '',
      observations: '',
      exercises: [{ id: `ex-${i}-0`, name: '', sets: '', reps: '', load: '', interval: '', advancedTechnique: '' }],
    }));
    setWorkouts(newWorkouts);
  };
  
  const handleWorkoutDayChange = (workoutIndex: number, field: 'musclesWorked' | 'observations', value: string) => {
    const newWorkouts = [...workouts];
    newWorkouts[workoutIndex][field] = value;
    setWorkouts(newWorkouts);
  };

  const handleExerciseChange = (workoutIndex: number, exIndex: number, field: keyof Omit<Exercise, 'id'>, value: string) => {
    const newWorkouts = [...workouts];
    (newWorkouts[workoutIndex].exercises[exIndex] as any)[field] = value;
    setWorkouts(newWorkouts);
  };

  const addExercise = (workoutIndex: number) => {
    const newWorkouts = [...workouts];
    newWorkouts[workoutIndex].exercises.push({
      id: `ex-${workoutIndex}-${Date.now()}`,
      name: '', sets: '', reps: '', load: '', interval: '', advancedTechnique: ''
    });
    setWorkouts(newWorkouts);
  };

  const removeExercise = (workoutIndex: number, exIndex: number) => {
    const newWorkouts = [...workouts];
    if (newWorkouts[workoutIndex].exercises.length > 1) {
      newWorkouts[workoutIndex].exercises.splice(exIndex, 1);
      setWorkouts(newWorkouts);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 90);

    const plan: Omit<WorkoutPlan, 'id'> = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      trainingDaysPerWeek: trainingDays,
      workouts,
    };
    onSave(plan);
  };
  
  useState(() => {
    handleDaysChange(3);
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl relative max-h-[90vh]">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-700">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Criar Nova Ficha de Treino</h2>
              <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
                <XIcon />
              </button>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-300">Dias de treino por semana:</label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5, 6].map(day => (
                  <button type="button" key={day} onClick={() => handleDaysChange(day)} className={`px-4 py-2 rounded-md font-semibold ${trainingDays === day ? 'bg-sky-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 flex-grow overflow-y-auto">
            <div className="space-y-6">
              {workouts.map((workout, workoutIndex) => (
                <div key={workout.id} className="bg-slate-700/50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-sky-400 mb-2">{workout.name}</h3>
                   <input 
                    type="text" 
                    placeholder="Músculos trabalhados (ex: Peito, Tríceps, Ombro)" 
                    value={workout.musclesWorked} 
                    onChange={e => handleWorkoutDayChange(workoutIndex, 'musclesWorked', e.target.value)} 
                    className="w-full bg-slate-900 p-2 rounded-md mb-4" 
                  />
                  <div className="space-y-2">
                    {workout.exercises.map((ex, exIndex) => (
                      <div key={ex.id} className="p-3 bg-slate-800/70 rounded-lg grid grid-cols-1 md:grid-cols-8 gap-2 items-center">
                          <input type="text" placeholder="Exercício" value={ex.name} onChange={e => handleExerciseChange(workoutIndex, exIndex, 'name', e.target.value)} className="md:col-span-2 bg-slate-900 p-2 rounded-md" required />
                          <input type="text" placeholder="Séries" value={ex.sets} onChange={e => handleExerciseChange(workoutIndex, exIndex, 'sets', e.target.value)} className="bg-slate-900 p-2 rounded-md" />
                          <input type="text" placeholder="Reps" value={ex.reps} onChange={e => handleExerciseChange(workoutIndex, exIndex, 'reps', e.target.value)} className="bg-slate-900 p-2 rounded-md" />
                          <input type="text" placeholder="Carga" value={ex.load} onChange={e => handleExerciseChange(workoutIndex, exIndex, 'load', e.target.value)} className="bg-slate-900 p-2 rounded-md" />
                          <input type="text" placeholder="Intervalo" value={ex.interval} onChange={e => handleExerciseChange(workoutIndex, exIndex, 'interval', e.target.value)} className="bg-slate-900 p-2 rounded-md" />
                          <input type="text" placeholder="Técnica" value={ex.advancedTechnique} onChange={e => handleExerciseChange(workoutIndex, exIndex, 'advancedTechnique', e.target.value)} className="bg-slate-900 p-2 rounded-md" />
                          <button type="button" onClick={() => removeExercise(workoutIndex, exIndex)} className="text-red-400 hover:text-red-300 p-2 bg-slate-900 rounded-md flex justify-center items-center h-full"><TrashIcon /></button>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => addExercise(workoutIndex)} className="mt-4 flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300">
                    <PlusIcon /> Adicionar Exercício
                  </button>
                  <textarea
                      placeholder="Observações gerais para o treino"
                      value={workout.observations}
                      onChange={e => handleWorkoutDayChange(workoutIndex, 'observations', e.target.value)}
                      className="w-full bg-slate-900 p-2 rounded-md mt-4"
                      rows={2}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-4 p-6 border-t border-slate-700">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg">Salvar Ficha</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkoutPlanForm;
