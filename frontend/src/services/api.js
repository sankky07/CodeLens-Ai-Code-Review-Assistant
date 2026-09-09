import axios from "axios";

const api = axios.create({

   baseURL: "https://codelens-ai-code-review-assistant.onrender.com",

    withCredentials: true

});

export default api;
