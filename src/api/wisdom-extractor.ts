import http from '~/api/http'
import type { WisdomResponse } from '~/types/wisdom-extractor'

export function extractWisdom(projectId: string, question: string): Promise<WisdomResponse> {
  return http.post(`/projects/${projectId}/wisdom-extractor`, { question })
}
