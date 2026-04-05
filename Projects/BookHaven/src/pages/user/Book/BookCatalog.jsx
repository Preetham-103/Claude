import React, { useState, useEffect, useCallback, useMemo } from "react";
// import Navbar from "./Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import BookSortOptions from "./BookSortOptions";
import { Nav, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import bookService from "../../../services/bookService"
import StyledWrapper from "./StyledWtapper";
import BookFilters from "./BookFilters";
import BookSearchBar from "./BookSearchBar";
import BookCard from "./BookCard";

const STATIC_CATALOG_BOOKS = [
  { bookId: "s1",  title: "Harry Potter & the Sorcerer's Stone", author: { authName: "J.K. Rowling" },         price: 499, imageUrl: "https://covers.openlibrary.org/b/isbn/9780439708180-L.jpg" },
  { bookId: "s2",  title: "The Hobbit",                          author: { authName: "J.R.R. Tolkien" },       price: 449, imageUrl: "https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg" },
  { bookId: "s3",  title: "The Fellowship of the Ring",          author: { authName: "J.R.R. Tolkien" },       price: 599, imageUrl: "https://covers.openlibrary.org/b/isbn/9780618640157-L.jpg" },
  { bookId: "s4",  title: "Dune",                                author: { authName: "Frank Herbert" },        price: 549, imageUrl: "https://covers.openlibrary.org/b/isbn/9780441013593-L.jpg" },
  { bookId: "s5",  title: "1984",                                author: { authName: "George Orwell" },        price: 299, imageUrl: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg" },
  { bookId: "s6",  title: "Brave New World",                     author: { authName: "Aldous Huxley" },        price: 349, imageUrl: "https://covers.openlibrary.org/b/isbn/9780060850524-L.jpg" },
  { bookId: "s7",  title: "The Hitchhiker's Guide to the Galaxy",author: { authName: "Douglas Adams" },        price: 399, imageUrl: "https://covers.openlibrary.org/b/isbn/9780345391803-L.jpg" },
  { bookId: "s8",  title: "To Kill a Mockingbird",               author: { authName: "Harper Lee" },           price: 349, imageUrl: "https://covers.openlibrary.org/b/isbn/9780061935466-L.jpg" },
  { bookId: "s9",  title: "The Great Gatsby",                    author: { authName: "F. Scott Fitzgerald" },  price: 299, imageUrl: "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg" },
  { bookId: "s10", title: "Pride and Prejudice",                 author: { authName: "Jane Austen" },          price: 249, imageUrl: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg" },
  { bookId: "s11", title: "Animal Farm",                         author: { authName: "George Orwell" },        price: 199, imageUrl: "https://covers.openlibrary.org/b/isbn/9780451526342-L.jpg" },
  { bookId: "s12", title: "The Catcher in the Rye",              author: { authName: "J.D. Salinger" },        price: 299, imageUrl: "https://covers.openlibrary.org/b/isbn/9780316769174-L.jpg" },
  { bookId: "s13", title: "The Da Vinci Code",                   author: { authName: "Dan Brown" },            price: 449, imageUrl: "https://covers.openlibrary.org/b/isbn/9780307474278-L.jpg" },
  { bookId: "s14", title: "Gone Girl",                           author: { authName: "Gillian Flynn" },        price: 399, imageUrl: "https://covers.openlibrary.org/b/isbn/9780307588364-L.jpg" },
  { bookId: "s15", title: "The Alchemist",                       author: { authName: "Paulo Coelho" },         price: 349, imageUrl: "https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg" },
  { bookId: "s16", title: "The Hunger Games",                    author: { authName: "Suzanne Collins" },      price: 449, imageUrl: "https://covers.openlibrary.org/b/isbn/9780439023481-L.jpg" },
  { bookId: "s17", title: "The Girl with the Dragon Tattoo",     author: { authName: "Stieg Larsson" },        price: 499, imageUrl: "https://covers.openlibrary.org/b/isbn/9780307454546-L.jpg" },
  { bookId: "s18", title: "Fahrenheit 451",                      author: { authName: "Ray Bradbury" },         price: 299, imageUrl: "https://covers.openlibrary.org/b/isbn/9781451673319-L.jpg" },
  { bookId: "s19", title: "The Picture of Dorian Gray",          author: { authName: "Oscar Wilde" },          price: 249, imageUrl: "https://covers.openlibrary.org/b/isbn/9780141439570-L.jpg" },
  { bookId: "s20", title: "Crime and Punishment",                author: { authName: "Fyodor Dostoevsky" },    price: 349, imageUrl: "https://covers.openlibrary.org/b/isbn/9780486415871-L.jpg" },
];

const BookCatalog = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Relevance");

  // States for filters from BookFilter.js
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");

  const BOOKS_PER_PAGE = 15;
  const [currentPage, setCurrentPage] = useState(1);

  const priceRanges = useMemo(
    () => [
      { label: "₹0 - ₹500", min: 0, max: 500 },
      { label: "₹501 - ₹1000", min: 501, max: 1000 },
      { label: "₹1001 - ₹1500", min: 1001, max: 1500 },
      { label: "₹1501+", min: 1501, max: Infinity },
    ],
    []
  );

  console.log(authors);

  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
    return books.slice(startIndex, startIndex + BOOKS_PER_PAGE);
  }, [books, currentPage]);

  useEffect(() => {
    const fetchInitialFilters = async () => {
      try {
        const [authorRes, categoryRes] = await Promise.all([
          bookService.getAuthors(),
          bookService.getCategories(),
        ]);
        setAuthors(authorRes.data);
        setCategories(categoryRes.data);
      } catch (err) {
        console.error("Error loading filter options:", err);
      }
    };
    fetchInitialFilters();
  }, []);
  const fetchBooksBasedOnFilters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // let fetchedBooks;
      let fetchedBooks = [];

      const noFiltersApplied =
        !selectedAuthor &&
        !selectedCategory &&
        selectedPriceRange === "" &&
        !searchQuery;


      if (noFiltersApplied) {
        const res = await bookService.getAllBooks();
        fetchedBooks = res.data;
      } else {
        if (selectedAuthor) {
          const res = await bookService.getBooksByAuthor(selectedAuthor);
          fetchedBooks = res.data;
        } else if (selectedCategory) {
          const res = await bookService.getBookByCategory(selectedCategory);
          fetchedBooks = res.data;
        } else if (selectedPriceRange !== "") {
          const range = priceRanges[selectedPriceRange];
          const res = await bookService.getBooksByPriceRange(
            range.min,
            range.max === Infinity ? 999999 : range.max
          );
          fetchedBooks = res.data;
        } else if (searchQuery) {
          const res = await bookService.getAllBooks();
          const allBooks = res.data;

          const filteredBooks = allBooks.filter((book) =>
            book.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
          console.log("Filtering books for partial search query:", searchQuery);
          fetchedBooks = filteredBooks;
        }
      }

      // const sortedBooks = [...fetchedBooks].sort((a, b) => {
      //   if (sortOption === "Price: Low to High") {
      //     return a.price - b.price;
      //   }
      //   if (sortOption === "Price: High to Low") {
      //     return b.price - a.price;
      //   }
      //   // 'Relevance' or default order from backend
      //   return 0;
      // });

      let sortedBooks = [];

      if (sortOption === "Relevance") {
        sortedBooks = [...fetchedBooks].sort(() => Math.random() - 0.5);
      } else if (sortOption === "Price: Low to High") {
        sortedBooks = [...fetchedBooks].sort((a, b) => a.price - b.price);
      } else if (sortOption === "Price: High to Low") {
        sortedBooks = [...fetchedBooks].sort((a, b) => b.price - a.price);
      } else {
        sortedBooks = [...fetchedBooks]
      }

      setBooks(sortedBooks);
      setCurrentPage(1);
    } catch (err) {
      setError(
        "Failed to fetch books. Please check your network or try again."
      );
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  }, [
    selectedAuthor,
    selectedCategory,
    selectedPriceRange,
    searchQuery,
    sortOption,
    priceRanges,
  ]);

  useEffect(() => {
    fetchBooksBasedOnFilters();
  }, [fetchBooksBasedOnFilters]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setSelectedAuthor("");
    setSelectedCategory("");
    setSelectedPriceRange("");
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleAuthorSelect = (authorName) => {
    setSelectedAuthor(authorName);
    setSelectedCategory("");
    setSelectedPriceRange("");
    setSearchQuery("");
  };

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setSelectedAuthor("");
    setSelectedPriceRange("");
    setSearchQuery("");
  };

  const handlePriceRangeSelect = (index) => {
    setSelectedPriceRange(index);
    setSelectedAuthor("");
    setSelectedCategory("");
    setSearchQuery("");
  };

  const getFilterLabel = (type) => {
    switch (type) {
      case "Category":
        return selectedCategory || "Category";
      case "Author":
        return selectedAuthor || "Author";
      case "Price Range":
        return selectedPriceRange !== ""
          ? priceRanges[selectedPriceRange].label
          : "Price Range";
      default:
        return "";
    }
  };

  const navigate = useNavigate();

  return (
    <div
      className="text-white min-vh-100"
      style={{
        background: " #212529",
        fontFamily: '"Work Sans", "Noto Sans", sans-serif',
      }}
    >

      <Container fluid className="px-md-5 py-4">
        <Container className="layout-content-container flex-column flex-grow-1">
          <button
            className="btn btn-outline-light mb-3"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <Row className="flex-wrap justify-content-between gap-3 p-3">

            <Col className="flex-column gap-3 min-w-72">
              <p className="text-white display-6 fw-bold mb-0">Book Catalog</p>
              <p className="text-secondary fs-6">
                Explore our extensive collection of books across various genres
                and authors.
              </p>
            </Col>
          </Row>

          <BookFilters
            categories={categories}
            authors={authors}
            priceRanges={priceRanges}
            selectedCategory={selectedCategory}
            selectedAuthor={selectedAuthor}
            selectedPriceRange={selectedPriceRange}
            onCategorySelect={handleCategorySelect}
            onAuthorSelect={handleAuthorSelect}
            onPriceRangeSelect={handlePriceRangeSelect}
            getFilterLabel={getFilterLabel}
          />

          {/* Search Bar for Books */}
          <BookSearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />

          <BookSortOptions
            sortOption={sortOption}
            onSortChange={handleSortChange}
          />

          {/* Loading, Error, and Book Grid */}
          {loading ? (
            <StyledWrapper>
              <div className="loader-wrapper">
                <div className="loader">
                  <span className="loader-text">loading</span>
                  <span className="load" />
                </div>
              </div>
            </StyledWrapper>
          ) : books.length > 0 ? (
            <>
              <Row xs={1} sm={2} md={3} lg={5} className="g-4 p-4">
                {paginatedBooks.map((book) => (
                  <Col key={book.bookId || book.id}>
                    <StyledWrapper>
                      <div><BookCard book={book} /></div>
                    </StyledWrapper>
                  </Col>
                ))}
              </Row>

              {/* Pagination — only shown for real API results */}
              <Row className="justify-content-center p-4">
                <Col xs="auto">
                  <Nav>
                    <Nav.Link
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="text-white rounded-pill"
                    >
                      <FontAwesomeIcon icon={faCaretLeft} />
                    </Nav.Link>
                    {[...Array(Math.ceil(books.length / BOOKS_PER_PAGE))].map((_, index) => (
                      <Nav.Link
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`text-white rounded-pill ${currentPage === index + 1 ? "bg-secondary" : ""}`}
                      >
                        {index + 1}
                      </Nav.Link>
                    ))}
                    <Nav.Link
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(books.length / BOOKS_PER_PAGE)))}
                      disabled={currentPage === Math.ceil(books.length / BOOKS_PER_PAGE)}
                      className="text-white rounded-pill"
                    >
                      <FontAwesomeIcon icon={faCaretRight} />
                    </Nav.Link>
                  </Nav>
                </Col>
              </Row>
            </>
          ) : (
            <Row xs={1} sm={2} md={3} lg={5} className="g-4 p-4">
              {STATIC_CATALOG_BOOKS.map((book) => (
                <Col key={book.bookId}>
                  <StyledWrapper>
                    <div><BookCard book={book} /></div>
                  </StyledWrapper>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </Container>
    </div>
  );
};

export default BookCatalog;
