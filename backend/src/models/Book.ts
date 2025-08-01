class Book {
  code: number;
  name: string;
  author: string;
  gender: string;
  is_available: boolean;
  constructor(
    code: number,
    name: string,
    author: string,
    gender: string,
    is_available: boolean,
  ) {
    this.code = code;
    this.name = name;
    this.author = author;
    this.gender = gender;
    this.is_available = is_available;
  }
}

let book = new Book(1, 'harry', 'q', 'w', true);

console.log(book.name);
