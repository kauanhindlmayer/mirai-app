import type { HttpClient } from '@/types'
import type { Board, BoardSummary, CreateBoardRequest } from '@/types/board'

export default interface BoardGateway {
  createBoard(projectId: string, request: CreateBoardRequest): Promise<string>
  getBoard(projectId: string, boardId: string): Promise<Board>
  listBoards(projectId: string): Promise<BoardSummary[]>
  deleteBoard(projectId: string, boardId: string): Promise<void>
}

export class BoardGatewayHttp implements BoardGateway {
  constructor(readonly http: HttpClient) {}

  createBoard(projectId: string, request: CreateBoardRequest): Promise<string> {
    return this.http.post(`/projects/${projectId}/boards`, request)
  }

  getBoard(projectId: string, boardId: string): Promise<Board> {
    return this.http.get(`/projects/${projectId}/boards/${boardId}`)
  }

  listBoards(projectId: string): Promise<BoardSummary[]> {
    return this.http.get(`/projects/${projectId}/boards`)
  }

  deleteBoard(projectId: string, boardId: string): Promise<void> {
    return this.http.delete(`/projects/${projectId}/boards/${boardId}`)
  }
}
