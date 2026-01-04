
import React, { useState, useEffect } from 'react';
import { Student, Gender } from '../types';
import { XIcon } from './icons';

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Omit<Student, 'id'> | Student) => void;
  student: Student | null;
}

const initialFormState = {
  name: '',
  birthDate: '',
  gender: Gender.Male,
  startDate: new Date().toISOString().split('T')[0],
  observations: '',
  assessments: [],
  workoutPlans: [],
  attendance: [],
};

const StudentForm: React.FC<StudentFormProps> = ({ isOpen, onClose, onSave, student }) => {
  const [formData, setFormData] = useState<Omit<Student, 'id'>>(initialFormState);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        birthDate: student.birthDate,
        gender: student.gender,
        startDate: student.startDate,
        observations: student.observations,
        assessments: student.assessments,
        workoutPlans: student.workoutPlans,
        attendance: student.attendance,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [student, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (student) {
      onSave({ ...formData, id: student.id });
    } else {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">{student ? 'Editar Aluno' : 'Novo Aluno'}</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <XIcon />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300">Nome Completo</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm text-white p-2 focus:ring-sky-500 focus:border-sky-500" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-slate-300">Data de Nascimento</label>
                <input type="date" name="birthDate" id="birthDate" value={formData.birthDate} onChange={handleChange} required className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm text-white p-2 focus:ring-sky-500 focus:border-sky-500" />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-slate-300">Sexo</label>
                <select name="gender" id="gender" value={formData.gender} onChange={handleChange} required className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm text-white p-2 focus:ring-sky-500 focus:border-sky-500">
                  {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-slate-300">Data de Início (Ficha)</label>
                <input type="date" name="startDate" id="startDate" value={formData.startDate} onChange={handleChange} required className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm text-white p-2 focus:ring-sky-500 focus:border-sky-500" />
            </div>
            <div>
              <label htmlFor="observations" className="block text-sm font-medium text-slate-300">Observações Gerais</label>
              <textarea name="observations" id="observations" value={formData.observations} onChange={handleChange} rows={4} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm text-white p-2 focus:ring-sky-500 focus:border-sky-500"></textarea>
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg">Salvar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;
