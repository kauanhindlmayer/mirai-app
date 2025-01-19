import type { HttpClient } from '@/types'
import type {
  Board,
  BoardSummary,
  CreateBoardColumnRequest,
  CreateBoardRequest,
  MoveCardRequest,
} from '@/types/board'

export default interface BoardGateway {
  createBoard(projectId: string, request: CreateBoardRequest): Promise<string>
  getBoard(projectId: string, boardId: string): Promise<Board>
  listBoards(projectId: string): Promise<BoardSummary[]>
  deleteBoard(projectId: string, boardId: string): Promise<void>
  moveCard(
    projectId: string,
    boardId: string,
    columnId: string,
    cardId: string,
    request: MoveCardRequest,
  ): Promise<void>
  createColumn(projectId: string, boardId: string, request: CreateBoardColumnRequest): Promise<void>
  deleteColumn(projectId: string, boardId: string, columnId: string): Promise<void>
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

  moveCard(
    projectId: string,
    boardId: string,
    columnId: string,
    cardId: string,
    request: MoveCardRequest,
  ): Promise<void> {
    return this.http.post(
      `/projects/${projectId}/boards/${boardId}/columns/${columnId}/cards/${cardId}/move`,
      request,
    )
  }

  createColumn(
    projectId: string,
    boardId: string,
    request: CreateBoardColumnRequest,
  ): Promise<void> {
    return this.http.post(`/projects/${projectId}/boards/${boardId}/columns`, request)
  }

  deleteColumn(projectId: string, boardId: string, columnId: string): Promise<void> {
    return this.http.delete(`/projects/${projectId}/boards/${boardId}/columns/${columnId}`)
  }
}
