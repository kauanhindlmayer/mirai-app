import http from '~/api/http'
import type {
  Board,
  BoardSummary,
  ColumnCardsResponse,
  CreateBoardColumnRequest,
  CreateBoardRequest,
  MoveCardRequest,
} from '~/types/board'
import type { BacklogLevel } from '~/types/team'

export function createBoard(teamId: string, request: CreateBoardRequest): Promise<string> {
  return http.post(`/teams/${teamId}/boards`, request)
}

export function getBoard(boardId: string, backlogLevel?: BacklogLevel): Promise<Board> {
  const params = {} as Record<string, string>
  if (backlogLevel) params.backlogLevel = backlogLevel
  return http.get(`/boards/${boardId}`, { params })
}

export function listBoards(projectId: string): Promise<BoardSummary[]> {
  return http.get(`/projects/${projectId}/boards`)
}

export function deleteBoard(boardId: string): Promise<void> {
  return http.delete(`/boards/${boardId}`)
}

export function moveCard(
  boardId: string,
  columnId: string,
  cardId: string,
  request: MoveCardRequest,
): Promise<void> {
  return http.post(`/boards/${boardId}/columns/${columnId}/cards/${cardId}/move`, request)
}

export function createColumn(boardId: string, request: CreateBoardColumnRequest): Promise<void> {
  return http.post(`/boards/${boardId}/columns`, request)
}

export function deleteColumn(boardId: string, columnId: string): Promise<void> {
  return http.delete(`/boards/${boardId}/columns/${columnId}`)
}

export function getColumnCards(
  boardId: string,
  columnId: string,
  backlogLevel?: BacklogLevel,
  page: number = 1,
  pageSize: number = 20,
): Promise<ColumnCardsResponse> {
  const params: Record<string, string> = {
    page: page.toString(),
    pageSize: pageSize.toString(),
  }
  if (backlogLevel) params.backlogLevel = backlogLevel
  return http.get(`/boards/${boardId}/columns/${columnId}/cards`, { params })
}
