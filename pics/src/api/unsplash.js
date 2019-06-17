import axios from 'axios';

export default axios.create({
  baseURL: 'https://api.unsplash.com',
  headers: {
    Authorization:
      'Client-ID c6b26448658392fa980d0e75bf1ad8bf369b0c09812b8446bcce8d60fb863bb0'
  }
});
