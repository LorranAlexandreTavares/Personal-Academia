
import React, { useState } from 'react';
import { Student, PhysicalAssessment, WorkoutPlan, WorkoutDay } from '../types';
import { ChevronLeftIcon, UserIcon, ClipboardListIcon, ChartBarIcon, DocumentTextIcon, CalendarIcon, PencilIcon, TrashIcon, PlusIcon } from './icons';
import { formatDate, getAge, getDaysUntilExpiration } from '../lib/utils';
import EvolutionCharts from './EvolutionCharts';
import AssessmentForm from './AssessmentForm';
import WorkoutPlanForm from './WorkoutPlanForm';
import { DumbbellIcon } from './icons';

type Tab = 'info' | 'assessments' | 'charts' | 'workout' | 'attendance' | 'history';

interface StudentProfileProps {
  student: Student;
  onBack: () => void;
  onUpdateStudent: (student: Student) => void;
  onEditStudent: () => void;
  onDeleteStudent: (id: string) => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ student, onBack, onUpdateStudent, onEditStudent, onDeleteStudent }) => {
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [isAssessmentFormOpen, setIsAssessmentFormOpen] = useState(false);
  const [isWorkoutFormOpen, setIsWorkoutFormOpen] = useState(false);

  const currentPlan = student.workoutPlans.length > 0 ? student.workoutPlans[student.workoutPlans.length - 1] : null;

  const handleSaveAssessment = (assessment: Omit<PhysicalAssessment, 'id'>) => {
    const newAssessment: PhysicalAssessment = {
      ...assessment,
      id: `assessment-${student.id}-${Date.now()}`,
    };
    const updatedStudent = {
      ...student,
      assessments: [...student.assessments, newAssessment].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    };
    onUpdateStudent(updatedStudent);
    setIsAssessmentFormOpen(false);
  };
  
  const handleSaveWorkoutPlan = (plan: Omit<WorkoutPlan, 'id'>) => {
    const newPlan: WorkoutPlan = {
      ...plan,
      id: `plan-${student.id}-${Date.now()}`,
    };
    const updatedStudent = {
      ...student,
      workoutPlans: [...student.workoutPlans, newPlan],
    };
    onUpdateStudent(updatedStudent);
    setIsWorkoutFormOpen(false);
  };

  const TabButton = ({ tab, icon, label }: { tab: Tab, icon: React.ReactNode, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        activeTab === tab ? 'bg-sky-500 text-white' : 'hover:bg-slate-700 text-slate-300'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button onClick={onBack} className="flex items-center gap-2 text-sky-400 hover:text-sky-300 font-semibold self-start">
          <ChevronLeftIcon />
          Voltar ao Painel
        </button>
        <div className="flex items-center gap-2 self-start sm:self-center">
            <button onClick={onEditStudent} className="p-2 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300">
                <PencilIcon />
            </button>
            <button onClick={() => onDeleteStudent(student.id)} className="p-2 rounded-md bg-slate-700 hover:bg-slate-600 text-red-400">
                <TrashIcon />
            </button>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
        <div className="flex items-center gap-4">
          <div className="bg-slate-700 p-4 rounded-full text-sky-400">
            <UserIcon />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">{student.name}</h2>
            <p className="text-slate-400">{getAge(student.birthDate)} anos, {student.gender}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 p-2 rounded-lg shadow-lg">
        <div className="flex flex-wrap items-center gap-2">
          <TabButton tab="info" icon={<UserIcon />} label="Informações" />
          <TabButton tab="assessments" icon={<ClipboardListIcon />} label="Avaliações" />
          <TabButton tab="charts" icon={<ChartBarIcon />} label="Gráficos" />
          <TabButton tab="workout" icon={<DumbbellIcon />} label="Ficha de Treino" />
          <TabButton tab="attendance" icon={<CalendarIcon />} label="Frequência" />
          <TabButton tab="history" icon={<DocumentTextIcon />} label="Histórico" />
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg shadow-lg min-h-[400px]">
        {activeTab === 'info' && <InfoTab student={student} />}
        {activeTab === 'assessments' && <AssessmentsTab student={student} onAddAssessment={() => setIsAssessmentFormOpen(true)} />}
        {activeTab === 'charts' && <EvolutionCharts assessments={student.assessments} />}
        {activeTab === 'workout' && <WorkoutTab plan={currentPlan} onNewPlan={() => setIsWorkoutFormOpen(true)} />}
        {/* Placeholder for other tabs */}
        {activeTab === 'attendance' && <div className="text-center p-8"><p>Controle de frequência em desenvolvimento.</p></div>}
        {activeTab === 'history' && <div className="text-center p-8"><p>Histórico de fichas em desenvolvimento.</p></div>}
      </div>
      
      {isAssessmentFormOpen && (
        <AssessmentForm 
            isOpen={isAssessmentFormOpen} 
            onClose={() => setIsAssessmentFormOpen(false)}
            onSave={handleSaveAssessment}
            height={student.assessments[0]?.height || 0}
            gender={student.gender}
            birthDate={student.birthDate}
        />
      )}
      {isWorkoutFormOpen && (
        <WorkoutPlanForm
          isOpen={isWorkoutFormOpen}
          onClose={() => setIsWorkoutFormOpen(false)}
          onSave={handleSaveWorkoutPlan}
        />
      )}

    </div>
  );
};

const InfoTab: React.FC<{ student: Student }> = ({ student }) => (
  <div>
    <h3 className="text-xl font-semibold text-white mb-4">Detalhes do Aluno</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
      <p><strong>Data de Nascimento:</strong> {formatDate(student.birthDate)}</p>
      <p><strong>Idade:</strong> {getAge(student.birthDate)} anos</p>
      <p><strong>Gênero:</strong> {student.gender}</p>
      <p><strong>Início na Academia:</strong> {formatDate(student.startDate)}</p>
      <div className="md:col-span-2">
        <p><strong>Observações:</strong></p>
        <p className="p-3 bg-slate-700/50 rounded-md mt-1 text-slate-400">{student.observations || 'Nenhuma observação.'}</p>
      </div>
    </div>
  </div>
);

const DetailItem: React.FC<{ label: string; value: React.ReactNode; unit?: string }> = ({ label, value, unit }) => (
  <div>
    <span className="text-sm text-slate-400">{label}</span>
    <p className="font-semibold text-white">
      {value} <span className="text-xs text-slate-400">{unit}</span>
    </p>
  </div>
);

const AssessmentsTab: React.FC<{ student: Student, onAddAssessment: () => void }> = ({ student, onAddAssessment }) => (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-semibold text-white">Avaliações Físicas</h3>
      <button onClick={onAddAssessment} className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors flex items-center gap-2">
        <PlusIcon /> Nova Avaliação
      </button>
    </div>
    <div className="space-y-6">
      {student.assessments.length > 0 ? student.assessments.map(assessment => (
        <div key={assessment.id} className="bg-slate-700/50 p-4 rounded-lg">
          <h4 className="font-bold text-sky-400 mb-4">Data: {formatDate(assessment.date)}</h4>
          
          <div className="mb-4 p-3 bg-slate-800/50 rounded-lg">
              <h5 className="text-md font-semibold text-white mb-2">Composição Corporal</h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <DetailItem label="Peso" value={assessment.weight} unit="kg" />
                  <DetailItem label="Altura" value={assessment.height} unit="cm" />
                  <DetailItem label="IMC" value={assessment.bmi} />
                  <DetailItem label="% Gordura" value={assessment.fatPercentage} unit="%" />
                  <DetailItem label="Peso Gordo" value={assessment.fatMass} unit="kg" />
                  <DetailItem label="Peso Magro" value={assessment.leanMass} unit="kg" />
              </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <h5 className="text-md font-semibold text-white mb-2">Medidas Corporais (cm)</h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                {Object.entries(assessment.bodyMeasurements).map(([key, value]) => (
                    <DetailItem key={key} label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} value={value} />
                ))}
              </div>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <h5 className="text-md font-semibold text-white mb-2">Dobras Cutâneas (mm)</h5>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 text-sm">
                {Object.entries(assessment.skinfolds).map(([key, value]) => (
                    <DetailItem key={key} label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} value={value} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )) : (
        <p className="text-center text-slate-400 p-8">Nenhuma avaliação física registrada.</p>
      )}
    </div>
  </div>
);

const WorkoutTab: React.FC<{ plan: WorkoutPlan | null, onNewPlan: () => void }> = ({ plan, onNewPlan }) => {
  const [openWorkoutId, setOpenWorkoutId] = useState<string | null>(plan?.workouts[0]?.id || null);

  if (!plan) {
    return (
      <div className="text-center p-8">
        <p className="text-slate-400 mb-4">Nenhuma ficha de treino ativa.</p>
        <button onClick={onNewPlan} className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors flex items-center gap-2 mx-auto">
            <PlusIcon /> Criar Nova Ficha
        </button>
      </div>
    );
  }
  
  const selectedWorkout = plan.workouts.find(w => w.id === openWorkoutId);
  const daysLeft = getDaysUntilExpiration(plan.endDate);

  return (
    <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="text-xl font-semibold text-white">Ficha de Treino Ativa</h3>
            <div className={`text-center p-2 rounded-lg ${daysLeft <= 15 ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'}`}>
                <p className="font-bold">{daysLeft} dias restantes</p>
                <p className="text-xs">Vence em: {formatDate(plan.endDate)}</p>
            </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4 flex flex-col gap-2">
                {plan.workouts.map(workout => (
                    <button 
                        key={workout.id}
                        onClick={() => setOpenWorkoutId(workout.id)}
                        className={`p-3 rounded-lg text-left font-semibold transition-colors ${openWorkoutId === workout.id ? 'bg-sky-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
                    >
                        {workout.name}
                    </button>
                ))}
            </div>
            <div className="md:w-3/4">
              {selectedWorkout && (
                <div>
                  {selectedWorkout.musclesWorked && (
                    <div className="mb-4 p-3 bg-slate-700 rounded-lg">
                      <p><strong>Foco:</strong> <span className="text-sky-300">{selectedWorkout.musclesWorked}</span></p>
                    </div>
                  )}

                  {selectedWorkout.exercises.map((exercise, index) => (
                      <div key={exercise.id} className={`p-4 ${index < selectedWorkout.exercises.length - 1 ? 'border-b border-slate-700' : ''}`}>
                          <h4 className="text-lg font-bold text-sky-400">{exercise.name}</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 mt-2 text-sm">
                              <p><strong>Séries:</strong> {exercise.sets}</p>
                              <p><strong>Reps:</strong> {exercise.reps}</p>
                              <p><strong>Carga:</strong> {exercise.load}</p>
                              <p><strong>Intervalo:</strong> {exercise.interval}</p>
                          </div>
                          {exercise.advancedTechnique && (
                            <p className="text-sm mt-2 text-slate-300">
                              <strong>Técnica:</strong> <span className="font-semibold text-yellow-400">{exercise.advancedTechnique}</span>
                            </p>
                          )}
                      </div>
                  ))}

                  {selectedWorkout.observations && (
                     <div className="mt-4 p-3 bg-slate-700 rounded-lg">
                      <p className="text-sm"><strong>Observações do Treino:</strong></p>
                      <p className="text-slate-400 text-sm mt-1">{selectedWorkout.observations}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
        </div>
    </div>
  );
};


export default StudentProfile;
