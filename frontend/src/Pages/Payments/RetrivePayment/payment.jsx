import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "jspdf-autotable";

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3500/api/v1/payment/pgetAll");
        setPayments(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const deletePayment = async (paymentId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post("http://localhost:3500/api/v1/payment/pdelete", { id: paymentId });
        setPayments((prevPayments) => prevPayments.filter((payment) => payment._id !== paymentId));
        await Swal.fire('Deleted!', 'The payment has been deleted.', 'success');
      } catch (error) {
        console.error(error);
        await Swal.fire('Error!', 'An error occurred while deleting the payment.', 'error');
      }
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.autoTable({
      head: [['Order_Id', "Supplier's name", 'Category', 'Brand', 'Model', 'Quantity']],
      body: payments.map((payment, index) => [
        index + 1,
        payment.reportName,
        payment.reportType,
        payment.date,
        payment.for,
        payment.amount
      ]),
    });

    doc.save('payment_list.pdf');
  };

  const filteredPayments = payments.filter(payment =>
    payment.reportName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.reportType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.for.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.amount.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="OrderTable">
      <Link to="/payments" className="addButton">
        Place Orders
      </Link>
      <h3>Order List</h3>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={generatePDF}>Generate PDF</button>
      <table border={1} cellPadding={10} cellSpacing={0}>
        <thead>
          <tr>
            <th>Order_Id</th>
            <th>Supplier's name</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Model</th>
            <th>Quantity</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayments.map((payment, index) => (
            <tr key={payment._id}>
              <td>{index + 1}</td>
              <td>{payment.reportName}</td>
              <td>{payment.reportType}</td>
              <td>{payment.date}</td>
              <td>{payment.for}</td>
              <td>{payment.amount}</td>
              <td className="actionButtons">
                <Link to={`/payu/${payment._id}`}>
                  <button>
                    <i className="fa-solid fa-pen-to-square">Update</i>
                  </button>
                </Link>
               
                <button onClick={() => deletePayment(payment._id)}>
                  <i className="fa fa-trash">Delete</i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentList;
