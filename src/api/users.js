import axios from "axios"

const user_data = "https://jsonplaceholder.typicode.com";

export const getUsers = async () => {
  try {
    const response = await axios.get(`${user_data}/users`);
    return response.data;
  }
  catch (error) {
    console.error("error has occured", error)
    return [];
  }
}