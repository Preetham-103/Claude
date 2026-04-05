import axios from "./api";

const getCategories = async () => {
  return axios.get(`/bookmanage/viewallcategories`);
};

const getBookByCategory = async (category) => {
  return axios.get(`/bookmanage/viewbycategory/${category}`);
};

const getAuthors = async () => {
  return axios.get(`/authormanage/viewallauthors`);
};

const getBooksByAuthor = async (authorName) => {
  return axios.get(`/bookmanage/viewbyauthor/${authorName}`);
};

const getBooksByPriceRange = async (min, max) => {
  return axios.get(`/bookmanage/price/${min}/${max}`);
};

const getAllBooks = async () => {
  return axios.get(`/bookmanage/viewallbooks`);
};

const getBookByTitle = async (title) => {
  return axios.get(`/bookmanage/viewbytitle/${title}`);
};


export const fetchRandomBooks = async() => {
  return axios.get(`/bookmanage/getRandombooks/12`);
};

export const fetchBookById = async(bookId) => {
  return axios.get(`/bookmanage/viewbookbyid/${bookId}`);
};

export const getBookById = (id) => axios.get(`/bookmanage/viewbookbyid/${id}`);




const bookService = {
  getCategories,
  getBookByCategory,
  getAuthors,
  getBooksByAuthor,
  getBooksByPriceRange,
  getAllBooks,
  getBookByTitle,
};



export default bookService;

