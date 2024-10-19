import Image from "next/image";
import { useState } from "react";
import Navbar from "./components/Navbar";

export default function Home() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    city: "",
    contact_number: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("User created successfully!");
      } else {
        alert("Failed to create user.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="main-container">
        <Image src={"/media/prodigy_infotech_logo.jpeg"} alt="Prodigy Infotech" width={200} height={60} />
        <form action="/cards" method="get">
          <input type="text" name="search" placeholder="Search by First name, Last name, City or Contact" id="searchBar" />
        </form>

        {/* Add New User Form */}
        <form onSubmit={handleSubmit} className="create-user-form">
          <h2>Create New User</h2>
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="contact_number"
            placeholder="Contact Number"
            value={formData.contact_number}
            onChange={handleChange}
            required
          />
          <button type="submit">Create User</button>
        </form>
      </div>
    </>
  );
}
