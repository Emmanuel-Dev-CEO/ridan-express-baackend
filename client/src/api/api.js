import axios from 'axios'
const local = 'http://localhost:5000'
const production = 'https://ridanexpress-marketplace-backend.vercel.app/'

let api_url = ''
let mode = 'pro'

if(mode === 'pro') {
  api_url = production
}else {
    api_url = local  
}
const api = axios.create({
    baseURL: `${local}/api`,
    withCredentials : true
})
export default api