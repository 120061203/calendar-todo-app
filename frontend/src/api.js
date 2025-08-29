import axios from "axios";

const API_URL = "http://localhost:4000/api";

export const getTodos = () => axios.get(`${API_URL}/todos`);
export const addTodo = (todo) => axios.post(`${API_URL}/todos`, todo);
export const updateTodo = (id, todo) => axios.put(`${API_URL}/todos/${id}`, todo);
export const deleteTodo = (id) => axios.delete(`${API_URL}/todos/${id}`);

export const getEvents = () => axios.get(`${API_URL}/events`);
export const addEvent = (event) => axios.post(`${API_URL}/events`, event);
export const updateEvent = (id, event) => axios.put(`${API_URL}/events/${id}`, event);
export const deleteEvent = (id) => axios.delete(`${API_URL}/events/${id}`);
