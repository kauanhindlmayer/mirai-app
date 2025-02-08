import http from '~/api/http'
import type {
  Board,
  BoardSummary,
  CreateBoardColumnRequest,
  CreateBoardRequest,
  MoveCardRequest,
} from '~/types/board'

export function createBoard(teamId: string, request: CreateBoardRequest): Promise<string> {
  return http.post(`/teams/${teamId}/boards`, request)
}

export function getBoard(teamId: string, boardId: string): Promise<Board> {
  return http.get(`/teams/${teamId}/boards/${boardId}`)
}

export function listBoards(projectId: string): Promise<BoardSummary[]> {
  return http.get(`/projects/${projectId}/boards`)
}

export function deleteBoard(teamId: string, boardId: string): Promise<void> {
  return http.delete(`/teams/${teamId}/boards/${boardId}`)
}

export function moveCard(
  teamId: string,
  boardId: string,
  columnId: string,
  cardId: string,
  request: MoveCardRequest,
): Promise<void> {
  return http.post(
    `/teams/${teamId}/boards/${boardId}/columns/${columnId}/cards/${cardId}/move`,
    request,
  )
}

export function createColumn(
  teamId: string,
  boardId: string,
  request: CreateBoardColumnRequest,
): Promise<void> {
  return http.post(`/teams/${teamId}/boards/${boardId}/columns`, request)
}

export function deleteColumn(teamId: string, boardId: string, columnId: string): Promise<void> {
  return http.delete(`/teams/${teamId}/boards/${boardId}/columns/${columnId}`)
}
