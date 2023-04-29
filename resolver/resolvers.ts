const controller = require('../controller/example.controller');

const _resolvers = {
  Query: {
    books: () => controller.getBooks(),
  },
  Mutation: {
    addBook: (title:string, author:string) => controller.addBook(title, author),
  },
};

module.exports = _resolvers;
