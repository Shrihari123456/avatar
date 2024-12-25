import React, { useState } from "react";
import Avatar from "avataaars"; // Install using `npm install avataaars`

const App = () => {
  const [userText, setUserText] = useState(""); // Stores user speech as text
  const [responseText, setResponseText] = useState("Let's start the conversation!"); // Initial system response
  const [isSpeaking, setIsSpeaking] = useState(false); // Lip-sync state
  const [isListening, setIsListening] = useState(false); // Speech recognition state
  const [questionIndex, setQuestionIndex] = useState(0); // Track which question to ask
  const [questions, setQuestions] = useState([ // Example set of questions, these could come from your backend
    "What is your name?",
    "What subjects do you teach?",
    "What is your favorite subject?"
  ]);

  // Start the text-to-speech and animate mouth for lip sync
  const handleSpeak = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);

      // Start and stop lip animation with speech events
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsListening(true); // Start listening after the speech finishes
      };

      speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser does not support text-to-speech!");
    }
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Sorry, your browser does not support speech recognition!");
      return;
    }

    setIsListening(true);

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => console.log("Listening...");
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      console.log("You said:", speechResult);

      // Update user text with the latest answer
      setUserText(speechResult);

      if (speechResult.toLowerCase() === "stop") {
        handleSpeak("Goodbye!");
        setResponseText("Goodbye!"); // End the interaction
        return; // Stop the interaction
      }

      handleResponse(); // Proceed to the next question after an answer
    };

    recognition.onerror = (event) => console.error("Speech recognition error:", event.error);
    recognition.onend = () => {
      setIsListening(false);
      console.log("Stopped listening.");
    };

    recognition.start();
  };

  // Handle the user's answer and move to the next question
  const handleResponse = () => {
    // Move to the next question
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1); // Move to the next question
      setResponseText(""); // Clear previous response text (do not show previous answers)
      handleSpeak(questions[questionIndex + 1]); // Ask the next question
    } else {
      setResponseText("Thank you for your responses! Goodbye!");
      handleSpeak("Thank you for your responses! Goodbye!");
      setQuestionIndex(0); // Optionally reset to first question after finishing
    }
  };

  // Ask the first question
  const askFirstQuestion = () => {
    if (questionIndex < questions.length) {
      setResponseText(""); // Clear response text before starting
      handleSpeak(questions[questionIndex]); // Ask the first question
    } else {
      setResponseText("Thank you for your responses!");
      handleSpeak("Thank you for your responses!");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", fontFamily: "Arial" }}>
      <h1>Interactive Male Teacher Avatar</h1>

      {/* Avatar Display */}
      <div style={{ position: "relative", display: "inline-block" }}>
        <Avatar
          style={{ width: "200px", height: "200px" }}
          avatarStyle="Circle"
          topType="ShortHairShortFlat"
          accessoriesType="Blank"
          facialHairType="BeardLight"
          hairColor="Black"
          clotheType="BlazerSweater"
          clotheColor="Gray02"
          skinColor="Light"
        />

        {/* Animated Mouth for Lip Syncing */}
        <div
          style={{
            position: "absolute",
            bottom: "25%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "40px",
            height: "20px",
            backgroundColor: "red",
            borderRadius: "50%",
            animation: isSpeaking ? "speak 0.2s infinite" : "none",
          }}
        ></div>
      </div>

      {/* User Interaction Section */}
      <div style={{ marginTop: "20px" }}>
        <p><strong>User's Speech:</strong> {userText || "Waiting for input..."}</p>
        <p><strong>System's Response:</strong> {responseText}</p>

        {/* Start Interaction Button */}
        <button
          onClick={askFirstQuestion}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#28A745",
            color: "#FFF",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Start Talking
        </button>

        {/* Submit User's Answer Button */}
        {isListening && (
          <button
            onClick={startListening}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#007BFF",
              color: "#FFF",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Submit Answer
          </button>
        )}
      </div>

      {/* Lip Sync Animation */}
      <style>{`
        @keyframes speak {
          0% { transform: translateX(-50%) scaleY(1); }
          50% { transform: translateX(-50%) scaleY(1.5); }
          100% { transform: translateX(-50%) scaleY(1); }
        }
      `}</style>
    </div>
  );
};

export default App;
