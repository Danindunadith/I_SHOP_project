import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2'; // Import SweetAlert2
import "./order.css";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:3500/api/v1/stock/getall");
      setOrders(response.data);
      setFilteredOrders(response.data);
    };

    fetchData();
  }, []);

  const deleteOrder = async (orderId) => {
    const url = "http://localhost:3500/api/v1/stock/delete";
    const payload = {
      id: orderId,
    };
    const config = {
      headers: {
        "x-apikey": "API_KEY",
      },
    };
    try {
      await axios.post(url, payload, config);
      setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
      // Show success alert using SweetAlert2
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Stock item deleted successfully',
      });
    } catch (error) {
      // Show error alert using SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete stock item',
      });
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
    doc.text(`Order Report - ${formattedDate}`, 10, 10);

    const tableColumn = ["Order ID", "Supplier's Name", "Category", "Brand", "Model"];
    const tableRows = orders.map(order => [order._id, order.name, order.category, order.brand, order.model]);
    
    doc.autoTable({
      head: [tableColumn],
      body: tableRows
    });

    doc.save('order_report.pdf');
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    filterOrders(event.target.value);
  };

  const filterOrders = (query) => {
    const filtered = orders.filter(order =>
      order.name.toLowerCase().includes(query.toLowerCase()) ||
      order.category.toLowerCase().includes(query.toLowerCase()) ||
      order.brand.toLowerCase().includes(query.toLowerCase()) ||
      order.model.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  return (
    <div className="OrderTable">
      <Link to={"/add"} className="addButton">
        Place Orders
      </Link>
      <button onClick={generateReport} className='reportButton'>Generate a Report</button>
      <input
        type="text"
        className="searchInput"
        value={searchQuery}
        onChange={handleSearchInputChange}
        placeholder="Search by any.."
      />
      <h3>Order List</h3>
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
          {filteredOrders.map((order, index) => (
            <tr key={order._id} className="text-black font-bold">
              <td>{index + 1}</td>
              <td>{order.name}</td>
              <td>{order.category}</td>
              <td>{order.brand}</td>
              <td>{order.model}</td>
              <td>{order.quantity}</td>
              <td className="actionButtons">
                <Link to={`/edit/${order._id}`}>
                  <i className="fa-solid fa-pen-to-square">Update</i>
                </Link>
              </td>
              <td className="actionButtons">
                <button onClick={() => deleteOrder(order._id)}>
                  <i className="fa-solid fa-trash">Delete</i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <Link to={"/coupons"} className="addButton">
        Apply Leave
      </Link>

      <Link to={"/payments"} className="addButton">
        Pay For Stocks
      </Link>
    </div>
  );
};

export default Order;
