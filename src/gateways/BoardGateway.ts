import type { HttpClient } from '@/types'
import type {
  Board,
  BoardSummary,
  CreateBoardColumnRequest,
  CreateBoardRequest,
  MoveCardRequest,
} from '@/types/board'

export default interface BoardGateway {
  createBoard(teamId: string, request: CreateBoardRequest): Promise<string>
  getBoard(teamId: string, boardId: string): Promise<Board>
  listBoardsByProjectId(projectId: string): Promise<BoardSummary[]>
  deleteBoard(teamId: string, boardId: string): Promise<void>
  moveCard(
    teamId: string,
    boardId: string,
    columnId: string,
    cardId: string,
    request: MoveCardRequest,
  ): Promise<void>
  createColumn(teamId: string, boardId: string, request: CreateBoardColumnRequest): Promise<void>
  deleteColumn(teamId: string, boardId: string, columnId: string): Promise<void>
}

export class BoardGatewayHttp implements BoardGateway {
  constructor(readonly http: HttpClient) {}

  createBoard(teamId: string, request: CreateBoardRequest): Promise<string> {
    return this.http.post(`/teams/${teamId}/boards`, request)
  }

  getBoard(teamId: string, boardId: string): Promise<Board> {
    return this.http.get(`/teams/${teamId}/boards/${boardId}`)
  }

  listBoardsByProjectId(projectId: string): Promise<BoardSummary[]> {
    return this.http.get(`/projects/${projectId}/boards`)
  }

  deleteBoard(teamId: string, boardId: string): Promise<void> {
    return this.http.delete(`/teams/${teamId}/boards/${boardId}`)
  }

  moveCard(
    teamId: string,
    boardId: string,
    columnId: string,
    cardId: string,
    request: MoveCardRequest,
  ): Promise<void> {
    return this.http.post(
      `/teams/${teamId}/boards/${boardId}/columns/${columnId}/cards/${cardId}/move`,
      request,
    )
  }

  createColumn(teamId: string, boardId: string, request: CreateBoardColumnRequest): Promise<void> {
    return this.http.post(`/teams/${teamId}/boards/${boardId}/columns`, request)
  }

  deleteColumn(teamId: string, boardId: string, columnId: string): Promise<void> {
    return this.http.delete(`/teams/${teamId}/boards/${boardId}/columns/${columnId}`)
  }
}
