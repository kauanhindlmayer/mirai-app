import type BoardGateway from '@/gateways/BoardGateway'
import type { Board, BoardSummary, MoveCardRequest } from '@/types/board'
import { boardGatewayKey } from '@/utils/injection-keys'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { inject, ref } from 'vue'
import { useProjectStore } from './project'

export const useBoardStore = defineStore('boards', () => {
  const boardGateway = inject(boardGatewayKey) as BoardGateway
  const boards = ref<BoardSummary[]>([])
  const board = ref<Board | null>(null)
  const { project } = storeToRefs(useProjectStore())

  async function listBoards() {
    boards.value = await boardGateway.listBoards(project.value!.id)
  }

  async function getBoard(boardId: string) {
    board.value = await boardGateway.getBoard(project.value!.id, boardId)
  }

  async function moveCard(columnId: string, cardId: string, request: MoveCardRequest) {
    await boardGateway.moveCard(project.value!.id, board.value!.id, columnId, cardId, request)
  }

  return {
    boards,
    board,
    listBoards,
    getBoard,
    moveCard,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBoardStore, import.meta.hot))
}
