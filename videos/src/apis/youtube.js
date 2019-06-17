import axios from 'axios';

const KEY = 'AIzaSyDnIKcGulcJWUtmvELWHa6am-wEP556ItQ';

export default axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  params: {
    part: 'snippet',
    maxResults: 5,
    key: KEY
  }
});
