import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (!token) return config
  const publicRoutes = ['/users/login', '/users/register']
  const isPublicRoute = publicRoutes.includes(config.url!)
  if (!isPublicRoute) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axiosInstance
