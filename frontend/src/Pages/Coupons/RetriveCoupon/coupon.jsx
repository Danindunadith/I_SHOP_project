import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./coupon.css";
import Swal from 'sweetalert2'; // Import SweetAlert2

const Coupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const tableRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:3500/api/v1/coupon/cgetAll");
      setCoupons(response.data);
    };

    fetchData();
  }, []);

  const generatePdf = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [["Employee ID", "Employee Role", "Reason", "Email"]],
      body: coupons.map((coupon) => [coupon.name, coupon.ccategory, coupon.cbrand, coupon.mail]),
    });
    doc.save("Leave_list.pdf");
  };

  // Function to delete a coupon
  const deleteCoupon = async (couponId) => {
    try {
      // Show a confirmation alert using SweetAlert2
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this coupon!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      });

      if (result.isConfirmed) {
        // Make an HTTP request to delete the coupon
        await axios.post("http://localhost:3500/api/v1/coupon/cdelete", { id: couponId });

        // Update the state by filtering out the deleted coupon
        setCoupons(coupons.filter((coupon) => coupon._id !== couponId));

        // Show success alert using SweetAlert2
        Swal.fire('Deleted!', 'The coupon has been deleted.', 'success');
      }
    } catch (error) {
      // Show error alert using SweetAlert2
      Swal.fire('Error!', 'An error occurred while deleting the coupon.', 'error');
    }
  };

  const filteredCoupons = searchQuery
    ? coupons.filter((coupon) =>
        Object.values(coupon).some((value) => String(value).toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : coupons;

  return (
    <div className="OrderTable">
      <Link to={"/"} className="addButton">
        Home
      </Link>
      <h3>Coupon List</h3>
      <div className="searchBar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by any..."
        />
      </div>

      <div className="searchBar">
        <button onClick={generatePdf}>Generate PDF</button>
      </div>

      <table ref={tableRef} border={1} cellPadding={10} cellSpacing={0}>
        <thead>
          <tr>
            <th>Coupon_ID</th>
            <th>Coupon Code</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Email</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredCoupons.map((coupon, index) => (
            <tr key={coupon._id}>
              <td>{index + 1}</td>
              <td>{coupon.name}</td>
              <td>{coupon.ccategory}</td>
              <td>{coupon.cbrand}</td>
              <td>{coupon.mail}</td>
              <td>
                <Link to={`/edit-coupon/${coupon._id}`}>Edit</Link>
              </td>
              <td>
                <button
                  onClick={() => deleteCoupon(coupon._id)}
                  className="deleteButton"
>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Coupon;
