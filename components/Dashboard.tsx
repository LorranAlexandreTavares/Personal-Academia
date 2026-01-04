
import React from 'react';
import { Student } from '../types';
import { getDaysUntilExpiration, getAge } from '../lib/utils';
import { UserIcon, ClockIcon, PencilIcon, TrashIcon } from './icons';

interface DashboardProps {
  students: Student[];
  onSelectStudent: (id: string) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ students, onSelectStudent, onEditStudent, onDeleteStudent }) => {

  const getPlanStatus = (student: Student) => {
    const currentPlan = student.workoutPlans[student.workoutPlans.length - 1];
    if (!currentPlan) return { text: 'Sem ficha', color: 'text-gray-400', days: null };
    
    const daysLeft = getDaysUntilExpiration(currentPlan.endDate);
    if (daysLeft <= 0) return { text: 'Vencida', color: 'text-red-400', days: 0 };
    if (daysLeft <= 15) return { text: 'Vence em breve', color: 'text-yellow-400', days: daysLeft };
    return { text: 'Ativa', color: 'text-green-400', days: daysLeft };
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-white">Painel de Alunos</h2>
      {students.length === 0 ? (
        <div className="text-center py-16 bg-slate-800 rounded-lg">
          <p className="text-slate-400">Nenhum aluno cadastrado.</p>
          <p className="text-slate-500 mt-2">Clique em "Novo Aluno" para começar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {students.map(student => {
            const planStatus = getPlanStatus(student);
            return (
              <div key={student.id} className="bg-slate-800 rounded-lg shadow-lg overflow-hidden flex flex-col group">
                <div className="p-5 flex-grow cursor-pointer" onClick={() => onSelectStudent(student.id)}>
                  <div className="flex items-center gap-4 mb-4">
                     <div className="bg-slate-700 p-3 rounded-full">
                        <UserIcon />
                     </div>
                     <div>
                        <h3 className="text-lg font-semibold text-white truncate">{student.name}</h3>
                        <p className="text-sm text-slate-400">{getAge(student.birthDate)} anos</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <ClockIcon />
                    <span>Ficha:</span>
                    <span className={`font-medium ${planStatus.color}`}>
                      {planStatus.text}
                      {planStatus.days !== null && planStatus.days > 0 && ` (${planStatus.days} dias)`}
                    </span>
                  </div>
                </div>
                <div className="bg-slate-700/50 p-2 flex justify-end items-center gap-2 transition-opacity opacity-0 group-hover:opacity-100">
                   <button onClick={(e) => { e.stopPropagation(); onEditStudent(student); }} className="p-2 rounded-full hover:bg-slate-600 text-slate-300">
                        <PencilIcon />
                   </button>
                   <button onClick={(e) => { e.stopPropagation(); onDeleteStudent(student.id); }} className="p-2 rounded-full hover:bg-slate-600 text-red-400">
                       <TrashIcon />
                   </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
