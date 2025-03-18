import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Card,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Print as PrintIcon,
  FitnessCenter as FitnessIcon,
  LocalDining as NutritionIcon,
  LocalDrink as HydrationIcon,
  Info as InfoIcon,
  Scale as BMIIcon,
  Category as CategoryIcon,
  ListAlt as WorkoutIcon,
  Restaurant as NutritionPlanIcon,
} from "@mui/icons-material";

const GENDER_CHOICES = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const FITNESS_LEVEL_CHOICES = [
  { value: "beginner", label: "Beginner (No prior exercise experience)" },
  { value: "intermediate", label: "Intermediate (Exercises 2-3 times/week)" },
  { value: "advanced", label: "Advanced (Regular high-intensity training)" },
];

const ACTIVITY_LEVEL_CHOICES = [
  { value: "sedentary", label: "Sedentary (Little to no exercise)" },
  { value: "lightly_active", label: "Lightly Active (Light exercise 1-3 days/week)" },
  { value: "moderately_active", label: "Moderately Active (Moderate exercise 3-5 days/week)" },
  { value: "very_active", label: "Very Active (Hard exercise 6-7 days/week)" },
  { value: "extra_active", label: "Extra Active (Very hard exercise & physical job)" },
];

const GOAL_CHOICES = [
  { value: "weight_loss", label: "Weight Loss" },
  { value: "muscle_gain", label: "Muscle Gain" },
  { value: "strength", label: "Strength Training" },
  { value: "endurance", label: "Endurance Building" },
  { value: "flexibility", label: "Flexibility & Mobility" },
  { value: "general_fitness", label: "General Fitness" },
  { value: "maintenance", label: "Maintenance" },
];

const EXERCISE_SETTING_CHOICES = [
  { value: "gym", label: "Gym" },
  { value: "home", label: "Home" },
  { value: "outdoor", label: "Outdoor" },
  { value: "mixed", label: "Mixed" },
];

const SLEEP_PATTERN_CHOICES = [
  { value: "less_than_6", label: "Less than 6 hours" },
  { value: "6_to_8", label: "6-8 hours" },
  { value: "more_than_8", label: "More than 8 hours" },
];

const FitnessForm = ({ isLoggedIn, userData }) => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    weight: "",
    height: "",
    fitness_level: "",
    activity_level: "",
    goal: "",
    specific_area: "",
    target_timeline: "",
    medical_conditions: "",
    injuries_or_physical_limitation: "",
    exercise_setting: "",
    sleep_pattern: "",
    stress_level: 5,
  });

  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true); // Track profile fetch status
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState("");
  const [openWorkoutDialog, setOpenWorkoutDialog] = useState(false);
  const [openNutritionDialog, setOpenNutritionDialog] = useState(false);

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          throw new Error("No authentication token found. Please log in.");
        }

        // Fetch profile data from the backend
        const response = await axios.get("http://127.0.0.1:8000/api/profile/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Update formData with fetched profile data
        if (response.data) {
          setFormData((prevData) => ({
            ...prevData,
            age: response.data.age || "",
            gender: response.data.gender || "",
            weight: response.data.weight || "",
            height: response.data.height || "",
          }));
        }
      } catch (err) {
        console.error("Error fetching profile data:", err.response?.data || err.message);
        setError("Failed to fetch profile data. Please try again.");
      } finally {
        setFetchingProfile(false); // Stop loading
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = ["age", "weight", "gender", "height", "fitness_level", "activity_level", "goal"];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      setError`(Please fill in the following fields: ${missingFields.join(", ")})`;
      return;
    }

    setLoading(true);
    setError("");
    setRecommendation(null);

    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("No authentication token found. Please log in.");
      }

      // Map gender value to backend format
      const backendFormData = {
        ...formData,
        gender: formData.gender === "Female" ? "female" : formData.gender === "Male" ? "male" : "other", // Adjust based on backend requirements
      };

      // Hit the actual API endpoint
      const response = await axios.post(
        "http://127.0.0.1:8000/fitness/fitness-recommendation/", // Replace with your actual API endpoint
        backendFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.data) {
        throw new Error("No data received from the API.");
      }

      console.log("API Response:", response.data); // Debugging log
      setRecommendation(response.data);
    } catch (err) {
      console.error("Error fetching recommendation:", err.response?.data || err.message);
      setError(err.response?.data?.detail || "Failed to get recommendations. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenWorkoutDialog = () => {
    setOpenWorkoutDialog(true);
  };

  const handleCloseWorkoutDialog = () => {
    setOpenWorkoutDialog(false);
  };

  const handleOpenNutritionDialog = () => {
    setOpenNutritionDialog(true);
  };

  const handleCloseNutritionDialog = () => {
    setOpenNutritionDialog(false);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("workout-plan-content").innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload to restore the original content
  };

  const renderWorkoutCards = (workoutPlan) => {
    if (!workoutPlan) return null;

    const days = workoutPlan.split("\n").filter((line) => line.trim() !== "");

    return (
      <Grid container spacing={3}>
        {days.map((day, index) => {
          const [dayLabel, workout] = day.split(":");
          if (!dayLabel || !workout) return null;
          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  padding: "20px",
                  textAlign: "center",
                  borderRadius: "12px",
                  boxShadow: 3,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#4a0066" }}>
                  {dayLabel.trim()}
                </Typography>
                <Typography sx={{ mt: 2, color: "#4a0066" }}>{workout.trim()}</Typography>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  // Nutrition Data
  const nutritionData = [
    {
      category: "Balanced Diet",
      details: [
        "Focus on a balanced diet rich in protein, complex carbohydrates, and healthy fats.",
        "Prioritize whole, unprocessed foods.",
        "Limit sugary drinks and processed foods.",
        "This plan is NOT about strict dieting, but about making healthy, sustainable food choices.",
      ],
    },
    {
      category: "Hydration",
      details: [
        "Drink plenty of water throughout the day.",
        "Aim for at least 8 glasses of water daily.",
        "Stay hydrated before, during, and after workouts.",
      ],
    },
    {
      category: "Important Notes",
      details: [
        "This plan is a starting point. Adjust as needed.",
        "Consult a qualified fitness professional for personalized guidance.",
        "Consult a registered dietitian for personalized nutritional advice.",
        "Consistency and patience are key to achieving your fitness goals.",
        "Focus on building sustainable habits for long-term success.",
      ],
    },
  ];

  const renderNutritionTable = () => {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "#4a0066" }}>Category</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#4a0066" }}>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {nutritionData.map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontWeight: "bold", color: "#4a0066" }}>{item.category}</TableCell>
                <TableCell>
                  <ul style={{ margin: 0, paddingLeft: "20px" }}>
                    {item.details.map((detail, idx) => (
                      <li key={idx} style={{ marginBottom: "8px" }}>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Image mapping for recommendation cards
  const cardImages = {
    BMI: "/images/bmi.jpg", // Path to BMI image
    "BMI Category": "/images/bmi-category.png", // Path to BMI category image
    "Workout Plan": "/images/workout.jpg", // Path to workout plan image
    "Nutrition Plan": "/images/nutritionplan.jpg", // Path to nutrition plan image
  };

  // Recommendation Cards
  const recommendationCards = [
    {
      title: "BMI",
      value: recommendation?.bmi || "N/A",
      icon: <BMIIcon sx={{ fontSize: 40, color: "#4a0066" }} />,
      image: cardImages["BMI"],
    },
    {
      title: "BMI Category",
      value: recommendation?.bmi_category || "N/A",
      icon: <CategoryIcon sx={{ fontSize: 40, color: "#4a0066" }} />,
      image: cardImages["BMI Category"],
    },
    {
      title: "Workout Plan",
      value: "See Workout Plan",
      icon: <WorkoutIcon sx={{ fontSize: 40, color: "#4a0066" }} />,
      image: cardImages["Workout Plan"],
      onClick: handleOpenWorkoutDialog,
    },
    {
      title: "Nutrition Plan",
      value: "See Nutrition Plan",
      icon: <NutritionPlanIcon sx={{ fontSize: 40, color: "#4a0066" }} />,
      image: cardImages["Nutrition Plan"],
      onClick: handleOpenNutritionDialog,
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f5f5f5", padding: "20px" }}>
      <Paper sx={{ padding: "40px", borderRadius: "12px", boxShadow: 5, width: "80%", maxWidth: "1200px" }}>
        <Typography variant="h4" sx={{ mb: 4, color: "#4a0066", fontWeight: "bold" }}>
          Get Your Personalized Fitness Plan
        </Typography>

        {fetchingProfile ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
            <CircularProgress sx={{ color: "#4a0066" }} />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    label="Gender"
                  >
                    {GENDER_CHOICES.map((choice) => (
                      <MenuItem key={choice.value} value={choice.value}>
                        {choice.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Weight"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Height"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Fitness Level</InputLabel>
                  <Select
                    name="fitness_level"
                    value={formData.fitness_level}
                    onChange={handleChange}
                    label="Fitness Level"
                  >
                    {FITNESS_LEVEL_CHOICES.map((choice) => (
                      <MenuItem key={choice.value} value={choice.value}>
                        {choice.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Activity Level</InputLabel>
                  <Select
                    name="activity_level"
                    value={formData.activity_level}
                    onChange={handleChange}
                    label="Activity Level"
                  >
                    {ACTIVITY_LEVEL_CHOICES.map((choice) => (
                      <MenuItem key={choice.value} value={choice.value}>
                        {choice.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Goal</InputLabel>
                  <Select
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    label="Goal"
                  >
                    {GOAL_CHOICES.map((choice) => (
                      <MenuItem key={choice.value} value={choice.value}>
                        {choice.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Specific Area"
                  name="specific_area"
                  value={formData.specific_area}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Target Timeline"
                  name="target_timeline"
                  value={formData.target_timeline}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Medical Conditions"
                  name="medical_conditions"
                  value={formData.medical_conditions}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Injuries or Physical Limitations"
                  name="injuries_or_physical_limitation"
                  value={formData.injuries_or_physical_limitation}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Exercise Setting</InputLabel>
                  <Select
                    name="exercise_setting"
                    value={formData.exercise_setting}
                    onChange={handleChange}
                    label="Exercise Setting"
                  >
                    {EXERCISE_SETTING_CHOICES.map((choice) => (
                      <MenuItem key={choice.value} value={choice.value}>
                        {choice.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Sleep Pattern</InputLabel>
                  <Select
                    name="sleep_pattern"
                    value={formData.sleep_pattern}
                    onChange={handleChange}
                    label="Sleep Pattern"
                  >
                    {SLEEP_PATTERN_CHOICES.map((choice) => (
                      <MenuItem key={choice.value} value={choice.value}>
                        {choice.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Stress Level"
                  name="stress_level"
                  type="number"
                  value={formData.stress_level}
                  onChange={handleChange}
                  fullWidth
                  inputProps={{ min: 1, max: 10 }}
                />
              </Grid>
            </Grid>

            <Button type="submit" variant="contained" sx={{ mt: 4, backgroundColor: "#4a0066", padding: "12px 30px", borderRadius: "8px" }}>
              Get Recommendation
            </Button>
          </form>
        )}

        {loading && <CircularProgress sx={{ mt: 3, color: "#4a0066" }} />}
        {error && (
          <Typography color="error" sx={{ mt: 2, fontWeight: "bold" }}>
            {error}
          </Typography>
        )}

        {recommendation && (
          <Box sx={{ mt: 5 }}>
            <Typography variant="h5" sx={{ mb: 4, fontWeight: "bold", color: "#4a0066" }}>
              Your Personalized Fitness Plan
            </Typography>
            <Grid container spacing={3}>
              {recommendationCards.map((card, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      padding: "20px",
                      textAlign: "center",
                      borderRadius: "12px",
                      boxShadow: 3,
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    {/* Card Image */}
                    <img
                      src={card.image}
                      alt={card.title}
                      style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }}
                    />
                    {/* Icon below the image */}
                    <Box sx={{ mt: 2 }}>
                      {card.icon}
                    </Box>
                    <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", color: "#4a0066" }}>
                      {card.title}
                    </Typography>
                    {card.onClick ? (
                      <Button
                        variant="contained"
                        sx={{ mt: 2, backgroundColor: "#4a0066", padding: "8px 20px", borderRadius: "8px" }}
                        onClick={card.onClick}
                      >
                        {card.value}
                      </Button>
                    ) : (
                      <Typography sx={{ mt: 2, color: "#4a0066" }}>{card.value}</Typography>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Workout Plan Dialog */}
      <Dialog open={openWorkoutDialog} onClose={handleCloseWorkoutDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold", color: "#4a0066" }}>7-Day Workout Plan</DialogTitle>
        <DialogContent>
          {recommendation?.recommendation_text ? (
            renderWorkoutCards(recommendation.recommendation_text)
          ) : (
            <Typography>No workout plan available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <IconButton onClick={handlePrint} sx={{ color: "#4a0066" }}>
            <PrintIcon />
          </IconButton>
          <Button onClick={handleCloseWorkoutDialog} sx={{ color: "#4a0066" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Nutrition Plan Dialog */}
      <Dialog open={openNutritionDialog} onClose={handleCloseNutritionDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold", color: "#4a0066" }}>Nutrition Plan</DialogTitle>
        <DialogContent>{renderNutritionTable()}</DialogContent>
        <DialogActions>
          <IconButton onClick={handlePrint} sx={{ color: "#4a0066" }}>
            <PrintIcon />
          </IconButton>
          <Button onClick={handleCloseNutritionDialog} sx={{ color: "#4a0066" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FitnessForm;