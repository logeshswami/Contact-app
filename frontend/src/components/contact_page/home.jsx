import React, { useEffect, useState } from "react";
import axios from "axios";
import './Home.css';
import Navbar from "./navbar";

const HomePage = ({ auth, onLogout }) => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add"); 

  const [currentContactId, setCurrentContactId] = useState(null);
  const [newContact, setNewContact] = useState({ Name: "", Phone: "", Email: "", Address: "", UserId: "" });
  const [errorMsg, setErrorMsg] = useState("");

  //load contact initially
  useEffect(() => {

    fetchContacts();
  }, []);

  // filter based on serch
  useEffect(() => {

    if (searchTerm.trim() ==="") {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter((contact) =>
        contact.Name.toLowerCase().includes(searchTerm.toLowerCase()) || contact.Phone.includes(searchTerm)
      );

      setFilteredContacts(filtered);
    }
  }, [searchTerm, contacts]);

  // req to fetch contact details
  const fetchContacts = async () => {
    try {
      const req_body = { user_id: auth.user.userId };
      const response = await axios.post("http://localhost:8080/contacts/fetch", req_body);
      setContacts(response.data);
      setFilteredContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error.response);
    } finally {
      setLoading(false);
    }
  };

  //req to del contact
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await axios.delete(`http://localhost:8080/contacts/${id}`);
        fetchContacts();
      } catch (error) {
        console.error("Error deleting contact:", error);
      }
    }
  };

  // func to  change form view state
  const handleView = (contact) => {


    setFormMode("update"); 
    setCurrentContactId(contact.ContactId); 
    setNewContact(contact); 
    setShowForm(true);
  };

  // req to add usr
  const handleAddContact = async () => {
    try {
      setErrorMsg("");
      const req_body = { ...newContact, UserID: auth.user.userId };
      const response = await axios.post("http://localhost:8080/contacts/add", req_body);
      setContacts([...contacts, response.data]);
      setFilteredContacts([...contacts, response.data]);
      fetchContacts();
      resetForm();
    } catch (error) {
      const errorMessage = error.response?.data?.error || "An error occurred. Please try again.";
      setErrorMsg(errorMessage);
    }
  };

  const handleUpdateContact = async () => {
    try {
      setErrorMsg("");
      const req_body = { ...newContact };
      await axios.put(`http://localhost:8080/contacts/${currentContactId}`, req_body);
      fetchContacts();
      resetForm();
    } catch (error) {
      const errorMessage = error.response?.data?.error || "An error occurred. Please try again.";
      setErrorMsg(errorMessage);
    }
  };

  //clr and reset form and states
  const resetForm = () => {
    setNewContact({ Name: "", Phone: "", Email: "", Address: "", UserId: auth.user.userId });
    setShowForm(false);
    setFormMode("add");
    setCurrentContactId(null);
    setErrorMsg("");
  };

  const isFormValid = () => {
    const phoneRegex = /^[0-9]{10}$/; 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return (
      newContact.Name.trim() !== "" &&
      phoneRegex.test(newContact.Phone) &&
      emailRegex.test(newContact.Email)
    );
  };

  return (
    <div className="contacts-page">
      <Navbar auth={auth} onLogout={onLogout} />
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍Search contacts  ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading contacts...</p>
      ) : (
        <div className="contacts-list">
          {filteredContacts.map((contact) => (
            <div className="contact-card" key={contact.ContactId}>
              <h2>{contact.Name}</h2>
              <p>Phone: {contact.Phone}</p>
              <div className="contact-actions">
                <button onClick={() => handleView(contact)}>View</button>
                <button onClick={() => handleDelete(contact.ContactId)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="add-button" onClick={() => setShowForm(true)}>+</button>

      {showForm && (
        <div className="form-popup">
        <center>
          <div className="form-content">
            {errorMsg && <p className="error-message">{errorMsg}</p>}
            <h2>{formMode === "add" ? "Add Contact" : "View Contact"}</h2>
            <input
              type="text"
              placeholder="Name"
              required
              maxLength="20"
              value={newContact.Name}
              onChange={(e) => setNewContact({ ...newContact, Name: e.target.value })}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              pattern="[0-9]{10}"
              maxLength="10"
              title="Please enter a 10-digit phone number"
              required
              value={newContact.Phone}
              onChange={(e) => setNewContact({ ...newContact, Phone: e.target.value })}
              className={!/^[0-9]{10}$/.test(newContact.Phone) && newContact.Phone ? "input-error" : ""}
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={newContact.Email}
              onChange={(e) => setNewContact({ ...newContact, Email: e.target.value })}
              className={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newContact.Email) && newContact.Email ? "input-error" : ""}
            />
            <input
              type="text"
              placeholder="Address"
              maxLength="25"
              value={newContact.Address}
              onChange={(e) => setNewContact({ ...newContact, Address: e.target.value })}
            />
            <div className="form-actions">
              <button className="pop-btn" onClick={resetForm}>
                Close
              </button>
              <button
                className="pop-btn"
                onClick={formMode === "add" ? handleAddContact : handleUpdateContact}
                disabled={!isFormValid()} 
              >
                {formMode === "add" ? "Save" : "Update"}
              </button>
              {console.log("form validity",isFormValid())}
            </div>
          </div>
        </center>
      </div>
      )}
    </div>
  );
};

export default HomePage;
