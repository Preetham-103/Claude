import { useEffect, useState } from "react";
import axios from "../../services/api";
import "./Book.css";
import EventEmitter from "../../utils/cartEvents"; // Custom event emitter

const Books = () => {
  const [books, setBooks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedStock, setSelectedStock] = useState("");

  const [showAddBook, setShowAddBook] = useState(false);
  const [showAddAuthor, setShowAddAuthor] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showUpdateBook, setShowUpdateBook] = useState(false);
  const [showAddStock, setShowAddStock] = useState(false);

  const [bookToUpdate, setBookToUpdate] = useState(null);
  const [bookToStock, setBookToStock] = useState(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [authName, setAuthName] = useState("");
  const [selectedCatId, setSelectedCatId] = useState("");
  const [selectedAuthId, setSelectedAuthId] = useState("");
  const [bookImage, setBookImage] = useState(null);
  const [stockToAdd, setStockToAdd] = useState("");

  const [deleteCategoryId, setDeleteCategoryId] = useState("");
  const [deleteAuthorId, setDeleteAuthorId] = useState("");

  // ✅ Fetch books/categories/authors
  const fetchData = async () => {
    const [bookRes, catRes, authRes] = await Promise.all([
      axios.get("/bookmanage/viewallbooks"),
      axios.get("/bookmanage/viewallcategories"),
      axios.get("/authormanage/viewallauthors"),
    ]);
    setBooks(bookRes.data);
    setFiltered(bookRes.data);
    setCategories(catRes.data);
    setAuthors(authRes.data);
  };

  // Register event listeners once
  useEffect(() => {
    fetchData();

    const handleRefresh = () => fetchData();

    EventEmitter.on("bookUpdated", handleRefresh);
    EventEmitter.on("bookAdded", handleRefresh);
    EventEmitter.on("categoryUpdated", handleRefresh);
    EventEmitter.on("categoryAdded", handleRefresh);
    EventEmitter.on("authorUpdated", handleRefresh);
    EventEmitter.on("authorAdded", handleRefresh);

    return () => {
      EventEmitter.off("bookUpdated", handleRefresh);
      EventEmitter.off("bookAdded", handleRefresh);
      EventEmitter.off("categoryUpdated", handleRefresh);
      EventEmitter.off("categoryAdded", handleRefresh);
      EventEmitter.off("authorUpdated", handleRefresh);
      EventEmitter.off("authorAdded", handleRefresh);
    };
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...books];
    if (selectedCategory) {
      result = result.filter(book => book.category?.catId === parseInt(selectedCategory));
    }
    if (selectedAuthor) {
      result = result.filter(book => book.author?.authId === parseInt(selectedAuthor));
    }
    if (selectedStock) {
      result = result.filter(book => {
        if (selectedStock === "critical") return book.stockQuantity <= 5;
        if (selectedStock === "low") return book.stockQuantity > 5 && book.stockQuantity <= 10;
        return book.stockQuantity > 10;
      });
    }
    setFiltered(result);
  }, [selectedCategory, selectedAuthor, selectedStock, books]);

  // ✅ Add Book
  const handleAddBook = async () => {
    if (!title || !price || !stock || !selectedCatId || !selectedAuthId) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const newBook = {
        title,
        price: parseFloat(price),
        stockQuantity: parseInt(stock),
        category: { catId: parseInt(selectedCatId) },
        author: { authId: parseInt(selectedAuthId) }
      };

      const res = await axios.post("/bookmanage/addbook", newBook);
      const bookId = res.data.bookId;

      if (bookId && bookImage) {
        const formData = new FormData();
        formData.append("image", bookImage);
        await axios.post(`/bookmanage/upload-image/${bookId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      EventEmitter.emit("bookAdded");
      setShowAddBook(false);
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book.");
    }
  };

  const handleUpdateBook = async () => {
    await axios.put(`/bookmanage/updatebook/${bookToUpdate.bookId}`, {
      ...bookToUpdate,
      category: { catId: parseInt(bookToUpdate.category.catId) },
      author: { authId: parseInt(bookToUpdate.author.authId) }
    });
    EventEmitter.emit("bookUpdated");
    setShowUpdateBook(false);
  };

  const handleAddCategory = async () => {
    await axios.post("/bookmanage/addnewcategory", {
      catName,
      catDescription: catDesc,
    });
    EventEmitter.emit("categoryAdded");
    setShowAddCategory(false);
  };

  const handleAddAuthor = async () => {
    await axios.post("/authormanage/addnewauthor", { authName });
    EventEmitter.emit("authorAdded");
    setShowAddAuthor(false);
  };

  const handleAddStock = async () => {
    const newStock = bookToStock.stockQuantity + parseInt(stockToAdd);
    await axios.put(`/bookmanage/updatebook/${bookToStock.bookId}`, {
      ...bookToStock,
      stockQuantity: newStock,
    });
    EventEmitter.emit("bookUpdated");
    setShowAddStock(false);
  };

  const handleDeleteCategory = async () => {
    try {
      if (deleteCategoryId) {
        await axios.delete(`/bookmanage/deletecategory/${deleteCategoryId}`);
        EventEmitter.emit("categoryUpdated");
      }
    } catch (err) {
      alert("Cannot delete category: " + err.response?.data || "An error occurred.");
    }
  };

  const handleDeleteAuthor = async () => {
    try {
      if (deleteAuthorId) {
        await axios.delete(`/authormanage/deleteauthor/${deleteAuthorId}`);
        EventEmitter.emit("authorUpdated");
      }
    } catch (err) {
      alert("Cannot delete author: " + err.response?.data || "An error occurred.");
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await axios.delete(`/bookmanage/deleteperementlybook/${id}`);
      EventEmitter.emit("bookUpdated");
    } catch (err) {
      alert("Cannot delete book: " + err.response?.data || "An error occurred.");
    }
  };

  // JSX return remains the same (the part with tables, modals, etc.)
  // You can paste your previous JSX part below this return line

  return (
    <div className="books-page">
      <div className="books-header">
        <h1>Books</h1>
        <div className="action-buttons">
          <button onClick={() => setShowAddBook(true)}>Add Book</button>
          <button onClick={() => setShowAddCategory(true)}>Add Category</button>
          <button onClick={() => setShowAddAuthor(true)}>Add Author</button>
        </div>
      </div>

      <div className="filter-toolbar">
        <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
          <option value="">Category</option>
          {categories.map(cat => (
            <option key={cat.catId} value={cat.catId}>{cat.catName}</option>
          ))}
        </select>

        <select onChange={(e) => setSelectedAuthor(e.target.value)} value={selectedAuthor}>
          <option value="">Author</option>
          {authors.map(auth => (
            <option key={auth.authId} value={auth.authId}>{auth.authName}</option>
          ))}
        </select>

        <select onChange={(e) => setSelectedStock(e.target.value)} value={selectedStock}>
          <option value="">Stock Status</option>
          <option value="critical">Critical (0–5)</option>
          <option value="low">Low (6–10)</option>
          <option value="in">In Stock (11+)</option>
        </select>
      </div>

      <div className="delete-section">
        <div className="delete-controls">
          <h4>Delete Category</h4>
          <select onChange={(e) => setDeleteCategoryId(e.target.value)} value={deleteCategoryId}>
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.catId} value={cat.catId}>{cat.catName}</option>
            ))}
          </select>
          <button onClick={handleDeleteCategory}>Delete</button>
        </div>

        <div className="delete-controls">
          <h4>Delete Author</h4>
          <select onChange={(e) => setDeleteAuthorId(e.target.value)} value={deleteAuthorId}>
            <option value="">Select Author</option>
            {authors.map(auth => (
              <option key={auth.authId} value={auth.authId}>{auth.authName}</option>
            ))}
          </select>
          <button onClick={handleDeleteAuthor}>Delete</button>
        </div>
      </div>

      <div className="scrollable-table">
        <table className="books-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Image</th>
              <th>Author</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((book, i) => (
              <tr key={i}>
                <td>{book.title}</td>
                <td>
                  {book.imageBase64 ? (
                    <img
                      src={`data:image/jpeg;base64,${book.imageBase64}`}
                      alt={book.title}
                      className="book-thumbnail"
                    />
                  ) : (
                    <span style={{ color: "#777" }}> No Image </span>
                  )}
                </td>
                <td>{book.author?.authName}</td>
                <td>{book.category?.catName}</td>
                <td>₹{book.price.toFixed(2)}</td>
                <td>{book.stockQuantity}</td>
                <td className={
                  book.stockQuantity <= 5 ? "stock critical" :
                    book.stockQuantity <= 10 ? "stock low" : "stock normal"
                }>
                  {book.stockQuantity > 10 ? "In Stock" : book.stockQuantity <= 5 ? "Critical" : "Low Stock"}
                </td>
                <td>
                  <button onClick={() => { setBookToStock(book); setShowAddStock(true); }}>Add Stock</button>
                  <button onClick={() => { setBookToUpdate(book); setShowUpdateBook(true); }}>Update</button>
                  <button onClick={() => handleDeleteBook(book.bookId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddBook && (
        <div className="modal-popup">
          <h3>Add Book</h3>
          <input type="text" id="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
          <input type="number" placeholder="Stock Quantity" value={stock} onChange={(e) => setStock(e.target.value)} />
          <select value={selectedCatId} onChange={(e) => setSelectedCatId(e.target.value)}>
            <option>Select Category</option>
            {categories.map(cat => <option key={cat.catId} value={cat.catId}>{cat.catName}</option>)}
          </select>
          <select value={selectedAuthId} onChange={(e) => setSelectedAuthId(e.target.value)}>
            <option>Select Author</option>
            {authors.map(auth => <option key={auth.authId} value={auth.authId}>{auth.authName}</option>)}
          </select>
          <input type="file" accept="image/*" onChange={(e) => setBookImage(e.target.files[0])} />
          <button onClick={handleAddBook}>Submit</button>
          <button onClick={() => setShowAddBook(false)}>Cancel</button>
        </div>
      )}

      {showUpdateBook && (
        <div className="modal-popup">
          <h3>Update Book</h3>
          <input type="text" value={bookToUpdate.title} onChange={(e) => setBookToUpdate({ ...bookToUpdate, title: e.target.value })} />
          <input type="number" value={bookToUpdate.price} onChange={(e) => setBookToUpdate({ ...bookToUpdate, price: parseFloat(e.target.value) })} />
          <input type="number" value={bookToUpdate.stockQuantity} onChange={(e) => setBookToUpdate({ ...bookToUpdate, stockQuantity: parseInt(e.target.value) })} />
          <button onClick={handleUpdateBook}>Submit</button>
          <button onClick={() => setShowUpdateBook(false)}>Cancel</button>
        </div>
      )}

      {showAddCategory && (
        <div className="modal-popup">
          <h3>Add Category</h3>
          <input type="text" placeholder="Category Name" value={catName} onChange={(e) => setCatName(e.target.value)} />
          <input type="text" placeholder="Description" value={catDesc} onChange={(e) => setCatDesc(e.target.value)} />
          <button onClick={handleAddCategory}>Submit</button>
          <button onClick={() => setShowAddCategory(false)}>Cancel</button>
        </div>
      )}

      {showAddAuthor && (
        <div className="modal-popup">
          <h3>Add Author</h3>
          <input type="text" placeholder="Author Name" value={authName} onChange={(e) => setAuthName(e.target.value)} />
          <button onClick={handleAddAuthor}>Submit</button>
          <button onClick={() => setShowAddAuthor(false)}>Cancel</button>
        </div>
      )}

      {showAddStock && (
        <div className="modal-popup">
          <h3>Add Stock for "{bookToStock.title}"</h3>
          <input type="number" placeholder="Add Quantity" value={stockToAdd} onChange={(e) => setStockToAdd(e.target.value)} />
          <button onClick={handleAddStock}>Submit</button>
          <button onClick={() => setShowAddStock(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Books;
