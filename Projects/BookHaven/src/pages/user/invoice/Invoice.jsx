import React, { useState, useEffect, useRef } from "react";
import bookicon from "../../../assets/books.png";
import { useLocation ,useNavigate} from 'react-router-dom';
import "./Invoice.css";
import { addOrder, getOrdersByUserId, fetchProfile, fetchUser, fetchPayment  } from "../../../services/invoice";
import html2canvas from 'html2canvas'; // Import html2canvas
import jsPDF from 'jspdf';  

const Invoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { successdetails, intitiateDetails } = location.state || {};

  const [order, setOrder] = useState({});
  const [resOrder, setResOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [payment, setPayment] = useState(null);
  let totalamount = 0;

  const invoiceRef = useRef();

  useEffect(() => {
    if (successdetails?.bok && intitiateDetails) {
      const books = successdetails.bok;
      const bookIdsWithQuantity = {};
      books.forEach(book => {
        // Assuming each book has bookId and quantity properties
        bookIdsWithQuantity[book.bookId] = book.quantity;
      });
      const orderObj = {
        userId: intitiateDetails.userId,
        totalAmount: intitiateDetails.amount,
        status:'Placed',
        paymentId: intitiateDetails.paymentId,
        bookIdsWithQuantity
      };
      setOrder(orderObj);
      console.log("Order object created:", orderObj);
    }
  }, [successdetails, intitiateDetails]);

  useEffect(() => {
    if (
      order &&
      order.userId &&
      order.paymentId &&
      order.totalAmount &&
      order.status && order.bookIdsWithQuantity
    ) {
      const placeOrder = async () => {
        try {
          const res = await addOrder(order);
          const orderdata = res.data;
          setResOrder(orderdata);
  
          const resuserdata = await fetchUser(orderdata.userId);
          setUser(resuserdata.data);
  
          const resprofiledata = await fetchProfile(orderdata.userId);
          setProfile(resprofiledata.data);
  
          const respayment = await fetchPayment(orderdata.paymentId);
          setPayment(respayment.data);
        } catch (error) {
          console.error("Error fetching data for invoice:", error);
        }
      };
  
      placeOrder();
      console.log("Order initiated");
    }
  }, [order]);

  const handleDownloadPdf = () => {
    if (invoiceRef.current) {
      html2canvas(invoiceRef.current, { scale: 2 }).then(canvas => { // Increased scale for better resolution
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' for portrait, 'mm' for millimeters, 'a4' size
        const imgWidth = 210;
        const pageHeight = 297; 
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        pdf.save(`invoice_${resOrder?.orderId || 'details'}.pdf`);
      }).catch(err => {
        console.error("Error generating PDF:", err);
        // You might want to show a user-friendly error message here
      });
    }
  };

  const handleHomeButton= () =>{
    navigate("/");
    window.location.reload();
  }

  if (!resOrder || !user || !profile || !payment) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <p>Loading invoice details...</p>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center flex-column inv-cont pt-5">
      <div ref={invoiceRef}  className="border border-dark bg-white pt-5 p-1 rounded-1 inv-cont2 text-dark">
        <div className="border border-dark p-1 rounded-1 bg-white">
          <div className="fw-bold fs-5">
            <img src={bookicon} alt="img" className="inv-icon mb-1" />
            BookHaven
          </div>
          <div className="fw-bold bg-dark text-white p-2">
            Order Placed Successfully !!
          </div>
          <div className="d-flex justify-content-between w-100 p-1">
            <div className="w-50">
              <div className="fw-bold">User Information</div>
              <div>Name : {user.name}</div>
              <div>Email: {user.email}</div>
              <div>Phone: {profile.phoneNumber}</div>
            </div>
            <div className="w-50">
              <div className="fw-bold">Address Information</div>
              <p className="text-justify">{profile.address}</p>
            </div>
          </div>
          <div className="fw-bold bg-dark text-white p-2 text-center">
            Order & Payment Information
          </div>
          <div className="d-flex justify-content-between p-1">
            <div className="w-50">
              <div className="fw-bold">Order Information</div>
              <div>Order Id : {resOrder.orderId}</div>
              <div>Order Status: {resOrder.status}</div>
            </div>
            <div className="w-50">
              <div className="fw-bold">Payment Information</div>
              <div>Payment ID: {payment.paymentId}</div>
              <div>Payment Method: {successdetails.meth}</div>
              <div>
                Payment Status:
                <span className="text-success fw-bold"> {payment.status}</span>
              </div>
              <div>Amount Payed : ₹ {payment.amount}</div>
            </div>
          </div>
          <table className="table table-bordered text-center border-dark">
            <thead className="table-dark">
              <tr>
                <th>Book Description</th>
                <th>Quantity</th>
                <th>Unit Price (₹)</th>
                <th>Total Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {resOrder.books.map((book, index) => {
                const total = book.quantity * book.price;
                totalamount +=total
                return (
                  <tr key={index}>
                    <td>{book.title}</td>
                    <td>{book.quantity}</td>
                    <td>{book.price.toFixed(2)}</td>
                    <td>{total.toFixed(2)}</td>
                  </tr>
                );
              })}
              <tr className="fw-bold">
                <td colSpan="3" className="text-end">
                  Shipping and Taxes
                </td>
                <td>{(resOrder.totalAmount-totalamount).toFixed(2)}</td>
              </tr>
              <tr className="fw-bold">
                <td colSpan="3" className="text-end">
                  Grand Total
                </td>
                <td>{resOrder.totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <div>Date: {resOrder.orderDate}</div>
        </div>
        
      </div>
      <div className="text-center mb-4">
        <button onClick={handleDownloadPdf} className="btn btn-primary">
          Download Invoice as PDF
        </button>

        <div className="back-button" onClick={handleHomeButton}>
                        ← Return to home page
                    </div>
      </div>
    </div>
  );
};

export default Invoice;
