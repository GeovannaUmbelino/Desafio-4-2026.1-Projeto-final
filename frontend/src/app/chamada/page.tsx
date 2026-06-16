'use client';

import { useCallback, useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import api, { getErrorMessage } from '@/lib/api';


interface Turma {
  id: string;
  name: string;
  code: string;
  schedule: string;
  studentIds: string[];
}

interface AlunoMinimo {
  id: string;
  name: string;
  matricula?: string;
}

type StatusMap = Record<string, 'present' | 'absent' | null>;


export default function ChamadaPage() {
  const { user } = useAuth();

  const [turmas, setTurmas]                   = useState<Turma[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>('');
  const [alunos, setAlunos]                   = useState<AlunoMinimo[]>([]);
  const [statusMap, setStatusMap]             = useState<StatusMap>({});
  const [date, setDate]                       = useState(new Date().toISOString().split('T')[0]);
  const [loadingTurmas, setLoadingTurmas]     = useState(true);
  const [loadingAlunos, setLoadingAlunos]     = useState(false);
  const [saving, setSaving]                   = useState(false);
  const [feedback, setFeedback]               = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  
  useEffect(() => {
    api.get<Turma[]>('/classes')
      .then(res => setTurmas(res.data))
      .catch(err => setFeedback({ type: 'error', msg: getErrorMessage(err) }))
      .finally(() => setLoadingTurmas(false));
  }, []);


  const handleSelectTurma = useCallback(async (classId: string) => {
    setTurmaSelecionada(classId);
    setStatusMap({});
    setAlunos([]);

    if (!classId) return;

    setLoadingAlunos(true);
    try {
      const turma = turmas.find(t => t.id === classId);
      if (!turma?.studentIds?.length) {
        setAlunos([]);
        return;
      }

      const res = await api.get<AlunoMinimo[]>(`/users/by-ids`, {
        params: { ids: turma.studentIds.join(',') },
      });
      setAlunos(res.data);

      
      const initial: StatusMap = {};
      res.data.forEach(a => { initial[a.id] = null; });
      setStatusMap(initial);
    } catch (err) {
      setFeedback({ type: 'error', msg: getErrorMessage(err) });
    } finally {
      setLoadingAlunos(false);
    }
  }, [turmas]);


  const marcar = (alunoId: string, status: 'present' | 'absent') => {
    setStatusMap(prev => ({ ...prev, [alunoId]: status }));
  };

  const salvarChamada = async () => {
    const naoMarcados = alunos.filter(a => statusMap[a.id] === null);
    if (naoMarcados.length > 0) {
      setFeedback({
        type: 'error',
        msg: `Marque todos os alunos antes de salvar. Faltam: ${naoMarcados.map(a => a.name).join(', ')}`,
      });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
     
      await api.post('/attendance/submit', {
        classId: turmaSelecionada,
        date,
        records: alunos.map(a => ({
          studentId: a.id,
          present: statusMap[a.id] === 'present',
        })),
      });

      setFeedback({ type: 'success', msg: 'Chamada salva com sucesso!' });
     
      const reset: StatusMap = {};
      alunos.forEach(a => { reset[a.id] = null; });
      setStatusMap(reset);
    } catch (err) {
      setFeedback({ type: 'error', msg: getErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  const turmaAtual    = turmas.find(t => t.id === turmaSelecionada);
  const totalPresentes = Object.values(statusMap).filter(s => s === 'present').length;
  const totalFaltas    = Object.values(statusMap).filter(s => s === 'absent').length;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Registrar Chamada</h2>

          {/* Seleção de turma e data */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 flex flex-wrap gap-4">
            <div className="flex-1 min-w-48">
              <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">Turma</label>
              <select
                value={turmaSelecionada}
                onChange={e => handleSelectTurma(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                disabled={loadingTurmas}
              >
                <option value="">{loadingTurmas ? 'Carregando turmas...' : 'Selecione a turma'}</option>
                {turmas.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">Data da aula</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Feedback de sucesso/erro */}
          {feedback && (
            <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
              feedback.type === 'success'
                ? 'bg-green-100 border border-green-400 text-green-700'
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              {feedback.msg}
            </div>
          )}

          {/* Lista de alunos */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            {!turmaSelecionada ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                <p className="text-4xl mb-3">👆</p>
                <p>Selecione uma turma para iniciar a chamada</p>
              </div>
            ) : loadingAlunos ? (
              <div className="text-center py-12 text-gray-500">
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p>Carregando alunos...</p>
              </div>
            ) : alunos.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>Nenhum aluno matriculado nesta turma.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {turmaAtual?.name} — {date}
                  </h3>
                  <div className="flex gap-4 text-sm font-medium">
                    <span className="text-green-600">✅ {totalPresentes} presentes</span>
                    <span className="text-red-500">❌ {totalFaltas} faltas</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {alunos.map(aluno => (
                    <div key={aluno.id}
                      className="flex justify-between items-center p-4 border rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">{aluno.name}</p>
                        {aluno.matricula && (
                          <p className="text-xs text-gray-400">Matrícula: {aluno.matricula}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => marcar(aluno.id, 'present')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            statusMap[aluno.id] === 'present'
                              ? 'bg-green-500 text-white ring-2 ring-green-300'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-100'
                          }`}
                        >
                          Presente
                        </button>
                        <button
                          onClick={() => marcar(aluno.id, 'absent')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            statusMap[aluno.id] === 'absent'
                              ? 'bg-red-500 text-white ring-2 ring-red-300'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-100'
                          }`}
                        >
                          Falta
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Botão de salvar */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={salvarChamada}
                    disabled={saving}
                    className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-lg transition-all flex items-center gap-2"
                  >
                    {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    {saving ? 'Salvando...' : '💾 Salvar Chamada'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
