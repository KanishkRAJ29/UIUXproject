import React, { useState } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51QNRwMJlzOeNyS4OVp7WK7UqmXnRQVnefbmYqfGkL5NVUrkhYe0n4dWNa1xZM66KlAIRNc2IFNvXEQ2ihgRoHxJh00suwi5kli");

const Donate = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [disablebtn, setDisablebtn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisablebtn(true);

    try {
      const response = await axios.post(
        "https://uiuxproject-backend.vercel.app/api/v1/checkout",
        { name, email, message, amount },
        {
          
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = response.data;

      if (data.sessionId) {
        const stripe = await stripePromise;
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        alert(data.error || "Failed to create payment session.");
      }
    } catch (error) {
      console.error("Error creating payment session:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setDisablebtn(false);
    }
  };

  return (
    <section className="donate">
      <form onSubmit={handleSubmit}>
        <div>
          <img src="/logo.png" alt="logo" />
        </div>
        <div>
          <label>Show your Love for Poor</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter Donation Amount(USD)"
          />
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Your Name"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email"
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
        />
        <button type="submit" className="btn" disabled={disablebtn}>
          Donate {amount ? `$${amount}` : "$0"}
        </button>
      </form>
    </section>
  );
};

export default Donate;
