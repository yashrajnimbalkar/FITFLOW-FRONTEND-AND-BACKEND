import React, { useState } from "react";
import MeditationTimer from "../components/mindful-moments/MeditationTimer";
import MoodJournal from "../components/mindful-moments/MoodJournal";
import BreathingExercise from "../components/mindful-moments/BreathingExercise";
import "./MindfulMoments.css"; // Import the CSS file

const MindfulMoments = () => {
  const [activeSection, setActiveSection] = useState("meditation");

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1>Mindful Moments</h1>
      </div>

      {/* Navigation Buttons */}
      <div className="nav">
        <button
          onClick={() => setActiveSection("meditation")}
          className={activeSection === "meditation" ? "active" : ""}
        >
          Meditation
        </button>
        <button
          onClick={() => setActiveSection("journal")}
          className={activeSection === "journal" ? "active" : ""}
        >
          Mood Journal
        </button>
        <button
          onClick={() => setActiveSection("breathing")}
          className={activeSection === "breathing" ? "active" : ""}
        >
          Breathing Exercise
        </button>
      </div>

      {/* Render Active Section */}
      {activeSection === "meditation" && <MeditationTimer />}
      {activeSection === "journal" && <MoodJournal />}
      {activeSection === "breathing" && <BreathingExercise />}
    </div>
  );
};

export default MindfulMoments;