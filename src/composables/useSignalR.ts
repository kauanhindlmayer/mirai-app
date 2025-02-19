import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr'
import { onUnmounted, ref } from 'vue'

export function useSignalR(hub: string) {
  const connection = ref<HubConnection | null>(null)
  const isConnected = ref(false)

  async function startConnection() {
    if (connection.value) return

    connection.value = new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_URL}${hub}`, {
        withCredentials: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build()

    try {
      await connection.value.start()
      isConnected.value = true
      console.log('Connected to SignalR hub')
    } catch (err) {
      console.error('Error connecting to SignalR hub:', err)
    }
  }

  async function stopConnection() {
    if (!connection.value) return
    await connection.value.stop()
    connection.value = null
    isConnected.value = false
    console.log('Disconnected from SignalR hub')
  }

  function on(event: string, callback: (...args: unknown[]) => void) {
    if (!connection.value) return
    connection.value.on(event, callback)
  }

  async function invoke(method: string, ...args: unknown[]) {
    if (!connection.value) return
    await connection.value.invoke(method, ...args)
  }

  onUnmounted(stopConnection)

  return {
    startConnection,
    stopConnection,
    on,
    invoke,
    isConnected,
  }
}
