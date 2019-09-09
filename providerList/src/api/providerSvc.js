import axios from 'axios';

// Setting up provider service root url
export default axios.create({
  baseURL: 'http://localhost:9000/providers'
});
