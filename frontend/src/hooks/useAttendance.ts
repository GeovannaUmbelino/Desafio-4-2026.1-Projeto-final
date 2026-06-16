import { useState, useCallback } from 'react';
import api, { getErrorMessage } from '@/lib/api';

export interface AttendanceRecord {
  studentId: string;
  present: boolean;
}

export interface SubmitPayload {
  classId: string;
  date: string;          
  records: AttendanceRecord[];
}

interface UseAttendanceReturn {
  submitting: boolean;
  error: string | null;
  success: boolean;
  submitAttendance: (payload: SubmitPayload) => Promise<boolean>;
  reset: () => void;
}

export function useAttendance(): UseAttendanceReturn {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [success, setSuccess]       = useState(false);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

 
  const submitAttendance = useCallback(async (payload: SubmitPayload): Promise<boolean> => {
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await api.post('/attendance/submit', payload);
      setSuccess(true);
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { submitting, error, success, submitAttendance, reset };
}
