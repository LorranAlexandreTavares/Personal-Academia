
import React, { useState, useMemo } from 'react';
import { initialStudents } from './lib/mockData';
import { Student } from './types';
import Dashboard from './components/Dashboard';
import StudentProfile from './components/StudentProfile';
import { PlusIcon } from './components/icons';
import StudentForm from './components/StudentForm';

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isStudentFormOpen, setIsStudentFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const selectedStudent = useMemo(() => {
    return students.find(s => s.id === selectedStudentId) || null;
  }, [students, selectedStudentId]);

  const handleSelectStudent = (id: string) => {
    setSelectedStudentId(id);
  };

  const handleBackToDashboard = () => {
    setSelectedStudentId(null);
  };
  
  const handleOpenStudentForm = (student: Student | null = null) => {
    setEditingStudent(student);
    setIsStudentFormOpen(true);
  };

  const handleCloseStudentForm = () => {
    setIsStudentFormOpen(false);
    setEditingStudent(null);
  };

  const handleSaveStudent = (studentData: Omit<Student, 'id'> | Student) => {
    if ('id' in studentData) {
      // Editing existing student
      setStudents(students.map(s => s.id === studentData.id ? studentData : s));
    } else {
      // Adding new student
      const newStudent: Student = {
        ...studentData,
        id: `student-${Date.now()}`,
      };
      setStudents([...students, newStudent]);
      setSelectedStudentId(newStudent.id);
    }
    handleCloseStudentForm();
  };

  const handleDeleteStudent = (id: string) => {
    if(window.confirm('Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.')) {
        setStudents(students.filter(s => s.id !== id));
        if (selectedStudentId === id) {
            setSelectedStudentId(null);
        }
    }
  };
  
  const updateStudent = (updatedStudent: Student) => {
      setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300">
      <header className="bg-slate-800/50 backdrop-blur-sm shadow-lg p-4 flex justify-between items-center sticky top-0 z-10 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-sky-400 cursor-pointer" onClick={handleBackToDashboard}>Gym Control Pro</h1>
        {!selectedStudent && (
          <button 
            onClick={() => handleOpenStudentForm()}
            className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors flex items-center gap-2"
          >
            <PlusIcon />
            Novo Aluno
          </button>
        )}
      </header>
      <main className="p-4 sm:p-6 lg:p-8">
        {selectedStudent ? (
          <StudentProfile 
            student={selectedStudent} 
            onBack={handleBackToDashboard}
            onUpdateStudent={updateStudent}
            onEditStudent={() => handleOpenStudentForm(selectedStudent)}
            onDeleteStudent={handleDeleteStudent}
          />
        ) : (
          <Dashboard 
            students={students} 
            onSelectStudent={handleSelectStudent}
            onEditStudent={handleOpenStudentForm}
            onDeleteStudent={handleDeleteStudent}
          />
        )}
      </main>
      
      {isStudentFormOpen && (
        <StudentForm
          isOpen={isStudentFormOpen}
          onClose={handleCloseStudentForm}
          onSave={handleSaveStudent}
          student={editingStudent}
        />
      )}
    </div>
  );
};

export default App;
