import type BoardGateway from '@/gateways/BoardGateway'
import type { Board, BoardSummary, MoveCardRequest } from '@/types/board'
import { boardGatewayKey } from '@/utils/injection-keys'
import { defineStore, storeToRefs } from 'pinia'
import { inject, ref } from 'vue'
import { useProjectStore } from './project'

export const useBoardStore = defineStore('boards', () => {
  const boardGateway = inject(boardGatewayKey) as BoardGateway
  const boards = ref<BoardSummary[]>([])
  const board = ref<Board | null>(null)
  const { project } = storeToRefs(useProjectStore())

  async function listBoards() {
    try {
      boards.value = await boardGateway.listBoards(project.value!.id)
    } catch (error) {
      console.error(error)
    }
  }

  async function getBoard(boardId: string) {
    try {
      board.value = await boardGateway.getBoard(project.value!.id, boardId)
    } catch (error) {
      console.error(error)
    }
  }

  async function moveCard(columnId: string, cardId: string, request: MoveCardRequest) {
    try {
      await boardGateway.moveCard(project.value!.id, board.value!.id, columnId, cardId, request)
    } catch (error) {
      console.error(error)
    }
  }

  return {
    boards,
    board,
    listBoards,
    getBoard,
    moveCard,
  }
})
