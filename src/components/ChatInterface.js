import { useState } from "react";
import { Button, Container, Form, Row, Col, Card } from "react-bootstrap";
import { FaRobot, FaUser } from "react-icons/fa";

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, { sender: "bot", content: data.response }]);
    setLoading(false);
  };

  // const sendMessage = async () => {
  //   if (!input.trim()) return;

  //   const userMessage = { sender: "user", content: input };
  //   setMessages((prev) => [...prev, userMessage]);
  //   setInput("");
  //   setLoading(true);

  //   try {
  //     const res = await fetch("/api/chat", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ message: input }),
  //     });

  //     if (!res.ok) {
  //       throw new Error(`HTTP error! status: ${res.status}`);
  //     }

  //     const data = await res.json();

  //     const botReply = data.response || "Sorry, I didn't understand that.";
  //     setMessages((prev) => [...prev, { sender: "bot", content: botReply }]);
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         sender: "bot",
  //         content: "Something went wrong. Please try again later.",
  //       },
  //     ]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-3 shadow">
            <Card.Body>
              <div
                style={{
                  height: "400px",
                  overflowY: "auto",
                  marginBottom: "1rem",
                }}
              >
                {messages.map((msg, i) => (
                  <p key={i}>
                    {msg.sender === "user" ? <FaUser /> : <FaRobot />}{" "}
                    <strong>{msg.sender}:</strong> {msg.content}
                  </p>
                ))}
              </div>
              <Form.Control
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                disabled={loading}
              />
              <div className="mt-2 text-end">
                <Button
                  variant="primary"
                  onClick={sendMessage}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send"}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
