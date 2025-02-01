import http from '@/gateways/HttpClient'
import type { Board, BoardSummary, CreateBoardColumnRequest, MoveCardRequest } from '@/types/board'

export function listBoards(projectId: string): Promise<BoardSummary[]> {
  return http.get<BoardSummary[]>(`/projects/${projectId}/boards`)
}

export async function getBoard(boardId: string): Promise<Board> {
  return http.get<Board>(`/boards/${boardId}`)
}

export function createColumn(boardId: string, request: CreateBoardColumnRequest): Promise<void> {
  return http.post<void>(`/boards/${boardId}/columns`, request)
}

export function deleteColumn(boardId: string, columnId: string): Promise<void> {
  return http.delete<void>(`/boards/${boardId}/columns/${columnId}`)
}

export function moveCard(
  boardId: string,
  columnId: string,
  cardId: string,
  request: MoveCardRequest,
): Promise<void> {
  return http.put<void>(`/boards/${boardId}/columns/${columnId}/cards/${cardId}/move`, request)
}
