/*

    THIS IS AN EXAMPLE FOR CONTROLLER. PLEASE DONT DELETE THIS FILE FOR 2 WEEKS

*/    


const books:any[] = [];

const getBooks = () => books;

const addBook = (title:string, author:string) => {
  const book = { id: books.length + 1, title, author };
  books.push(book);
  return book;
};

module.exports = { getBooks, addBook };
