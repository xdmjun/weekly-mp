import fly from './fly'
// import qs from 'qs'
import config from '../../config/prod.env'
const host = config.api_path

fly.config.baseURL = host
