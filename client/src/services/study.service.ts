import api from "@/lib/api";
import {
  Study,
  StudyCreateInput,
  AnswerSubmission,
  AnalysisResult,
} from "@/types";

export const studyService = {
  createStudy: async (data: StudyCreateInput): Promise<Study> => {
    const response = await api.post<Study>("/studies/", data);
    return response.data;
  },

  getStudy: async (studyId: string): Promise<Study> => {
    const response = await api.get<Study>(`/studies/${studyId}`);
    return response.data;
  },

  getStudyByCode: async (code: string): Promise<Study> => {
    const response = await api.get<Study>(`/studies/by-code/${code}`);
    return response.data;
  },

  submitAnswers: async (
    studyId: string,
    payload: AnswerSubmission
  ): Promise<AnalysisResult> => {
    const response = await api.post<AnalysisResult>(
      `/studies/${studyId}/answers`,
      payload
    );
    return response.data;
  },

  getAnalysis: async (studyId: string): Promise<AnalysisResult> => {
    const response = await api.get<AnalysisResult>(
      `/studies/${studyId}/analysis`
    );
    return response.data;
  },
};
