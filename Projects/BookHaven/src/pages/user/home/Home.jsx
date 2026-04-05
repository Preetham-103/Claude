import React, { useState, useEffect } from "react";
import dbook from "../../../assets/default.png";
import book6 from "../../../assets/Book6.jpg";
import post from "../../../assets/post.webp";
import post2 from "../../../assets/post2.webp";
import Book7 from "../../../assets/Book7.jpg";
import book1 from "../../../assets/book1.jpg";
import book2 from "../../../assets/book2.jpg";
import book3 from "../../../assets/book3.jpg";
import book5 from "../../../assets/book5.jpg";
import { fetchBookById, fetchRandomBooks } from "../../../services/bookService";
import { fetchRatingReview } from "../../../services/review";
import { useNavigate } from "react-router-dom";
import './Home.css'

const STATIC_TRENDING = [
  { bookId: "t1", title: "Jujutsu Kaisen Vol.1", author: { authName: "Gege Akutami" }, price: 349, img: book1 },
  { bookId: "t2", title: "Spy x Family Vol.13", author: { authName: "Tatsuya Endo" }, price: 299, img: book2 },
  { bookId: "t3", title: "Solo Leveling Vol.1", author: { authName: "Chugong" }, price: 499, img: book3 },
  { bookId: "t4", title: "Blue Lock Vol.1", author: { authName: "Muneyuki Kaneshiro" }, price: 349, img: book5 },
  { bookId: "t5", title: "Chainsaw Man Vol.1", author: { authName: "Tatsuki Fujimoto" }, price: 399, img: book6 },
];

const STATIC_FEATURED = [
  { bookId: "f1", title: "Demon Slayer Vol.1", author: { authName: "Koyoharu Gotouge" }, price: 349, img: Book7 },
  { bookId: "f2", title: "Attack on Titan Vol.1", author: { authName: "Hajime Isayama" }, price: 449, img: book3 },
  { bookId: "f3", title: "My Hero Academia Vol.1", author: { authName: "Kohei Horikoshi" }, price: 299, img: book1 },
  { bookId: "f4", title: "One Piece Vol.1", author: { authName: "Eiichiro Oda" }, price: 349, img: book5 },
  { bookId: "f5", title: "Naruto Vol.1", author: { authName: "Masashi Kishimoto" }, price: 299, img: book2 },
];

const SkeletonCards = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <div className="col-6 col-sm-4 col-md-3 col-lg-2 col-xl-2" key={i}>
        <div className="skeleton-card">
          <div className="skeleton-img" />
          <div className="skeleton-body">
            <div className="skeleton-line medium" />
            <div className="skeleton-line short" />
            <div className="skeleton-line short" />
          </div>
        </div>
      </div>
    ))}
  </>
);

const Home = () => {
  const [books, setBooks] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getBooks = async () => {
      try {
        const res = await fetchRandomBooks();
        setBooks(res.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    const getTrendBooks = async () => {
      try {
        const res = await fetchRatingReview();
        const reviews = res.data;
        const books = [];
        for (const review of reviews) {
          const bookRes = await fetchBookById(review.bookId);
          books.push(bookRes.data);
        }
        setTrends(books);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    getBooks();
    getTrendBooks();
  }, []);

  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh", paddingBottom: "3rem" }}>
      {/* Carousel */}
      <div className="container-fluid px-0">
        <div className="mt-2 mt-md-4">
          <div id="carouselExampleAutoplaying"
            className="carousel slide shadow rounded-0 rounded-md-3 overflow-hidden mx-2 mx-md-4"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src={book6} alt="book"/>
              </div>
              <div className="carousel-item">
                <img src={post2} alt="post2"/>
              </div>
              <div className="carousel-item">
                <img src={Book7} alt="post2"/>
              </div>
              <div className="carousel-item">
                <img src={post} alt="post"/>
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>

      {/* Trending Books */}
      <div className="container-fluid px-2 px-md-4 py-4">
        <div className="container-xxl">
          <div className="section-heading-home text-white-home fw-bold mt-3 mt-md-4 mb-3 mb-md-4">
            Trending Books
          </div>
          <div className="row g-3 g-md-4 justify-content-center justify-content-sm-start">
            {loading ? <SkeletonCards /> : (trends.length > 0 ? trends : STATIC_TRENDING).map((book, index) => (
              <div className="col-6 col-sm-4 col-md-3 col-lg-2 col-xl-2" key={index}>
                <div className="card shadow-sm h-100">
                  <div className="position-relative">
                    <img
                      src={book.img || (book.imageBase64 ? `data:image/png;base64,${book.imageBase64}` : dbook)}
                      alt={book.title}
                      className="card-img-top"
                    />
                  </div>
                  <div className="card-body p-2 p-sm-3 d-flex flex-column border-top border-secondary text-white-home bg-dark">
                    <h6 className="card-title mb-2 text-truncate" style={{ fontSize: "clamp(0.8rem, 2vw, 1rem)" }}>
                      {book.title}
                    </h6>
                    <p className="mb-1 text-truncate small" style={{ fontSize: "clamp(0.7rem, 1.5vw, 0.85rem)" }}>
                      By {book.author?.authName}
                    </p>
                    <div className="mb-2 fw-bold" style={{ fontSize: "clamp(0.8rem, 2vw, 1rem)" }}>
                      ₹ {book.price}
                    </div>
                    <button
                      className="btn-view-book btn-sm w-100 mt-auto"
                      onClick={() => navigate(`/user/book/${book.bookId}`)}
                    >
                      View Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Books */}
      <div className="container-fluid px-2 px-md-4 py-4">
        <div className="container-xxl">
          <div className="section-heading-home text-white-home fw-bold mt-3 mt-md-4 mb-3 mb-md-4">
            Featured Books
          </div>
          <div className="row g-3 g-md-4 justify-content-center justify-content-sm-start">
            {loading ? <SkeletonCards /> : (books.length > 0 ? books : STATIC_FEATURED).map((book, index) => (
              <div className="col-6 col-sm-4 col-md-3 col-lg-2 col-xl-2" key={index}>
                <div className="card shadow-sm h-100">
                  <div className="position-relative">
                    <img
                      src={book.img || (book.imageBase64 ? `data:image/png;base64,${book.imageBase64}` : dbook)}
                      alt={book.title}
                      className="card-img-top"
                    />
                  </div>
                  <div className="card-body p-2 p-sm-3 d-flex flex-column border-top border-secondary text-white-home bg-dark">
                    <h6 className="card-title mb-2 text-truncate" style={{ fontSize: "clamp(0.8rem, 2vw, 1rem)" }}>
                      {book.title}
                    </h6>
                    <p className="mb-1 text-truncate small" style={{ fontSize: "clamp(0.7rem, 1.5vw, 0.85rem)" }}>
                      By {book.author?.authName}
                    </p>
                    <div className="mb-2 fw-bold" style={{ fontSize: "clamp(0.8rem, 2vw, 1rem)" }}>
                      ₹ {book.price}
                    </div>
                    <button
                      className="btn-view-book btn-sm w-100 mt-auto"
                      onClick={() => navigate(`/user/book/${book.bookId}`)}
                    >
                      View Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;