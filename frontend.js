import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import QRCode from "qrcode.react";

const EventRegistration = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", contact: "" });
  const [registrationId, setRegistrationId] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;

    const response = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, eventId: selectedEvent._id }),
    });

    const result = await response.json();
    if (response.ok) {
      setRegistrationId(result.registrationId);
      setFormData({ name: "", email: "", contact: "" });
    } else {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Event Registration</h1>
      <div className="grid gap-4">
        {events.map((event) => (
          <motion.div whileHover={{ scale: 1.05 }} key={event._id}>
            <Card onClick={() => setSelectedEvent(event)} className={`cursor-pointer ${selectedEvent?._id === event._id ? "border-blue-500" : ""}`}>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold">{event.name}</h2>
                <p>{event.date}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedEvent && !registrationId && (
        <form onSubmit={handleRegister} className="mt-6 border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Register for {selectedEvent.name}</h2>
          <div className="mb-2">
            <Label>Name</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-2">
            <Label>Contact Number</Label>
            <Input
              type="tel"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="mt-2">Register</Button>
        </form>
      )}

      {registrationId && (
        <div className="mt-6 p-4 border rounded-lg text-center">
          <h2 className="text-xl font-semibold">Registration Successful!</h2>
          <p>Your Registration ID: <strong>{registrationId}</strong></p>
          <QRCode value={registrationId} className="mt-4" />
        </div>
      )}
    </div>
  );
};

export default EventRegistration.js;
