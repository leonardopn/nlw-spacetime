import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://10.0.10.101:3333',
})
