import React, { useState } from "react";
import {
  Typography,
  Box,
  IconButton,
  Card,
  CardContent,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Avatar,
  Modal,
  Button,
  TextField,
  Fab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FitnessCenter as FitnessCenterIcon,
  Restaurant as RestaurantIcon,
  SelfImprovement as SelfImprovementIcon,
  Spa as SpaIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Edit as EditIcon,
  Assessment as AssessmentIcon,
  Event as EventIcon,
  EmojiEvents as EmojiEventsIcon,
  People as CommunityIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import FitnessForm from "./FitnessForm";
import NutritionForm from "./NutritionForm";

const data = [
  { name: "Week 1", Exercises: 4000, Meals: 2400 },
  { name: "Week 2", Exercises: 3000, Meals: 1398 },
  { name: "Week 3", Exercises: 2000, Meals: 9800 },
  { name: "Week 4", Exercises: 2780, Meals: 3908 },
];

const drawerWidth = 280;
const cardWidth = 300;
const cardHeight = 150;

const paperStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "1200px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "12px",
};

const modalContentStyle = {
  maxHeight: "90vh",
  overflowY: "auto",
  padding: "16px",
};

function Services({ isLoggedIn, userData, isServicesInView }) {
  const primaryColor = "#6C63FF"; // Modern purple
  const secondaryColor = "#00BFA6"; // Vibrant teal
  const [darkMode, setDarkMode] = useState(false); // Default to light mode
  const backgroundColor = darkMode ? "#121212" : "#f5f5f5";
  const textColor = darkMode ? "#fff" : "#000";

  const [showFitnessForm, setShowNutritionForm] = useState(false);
  const [fitnessOutput, setFitnessOutput] = useState(null);
  const [nutritionOutput, setNutritionOutput] = useState(null);
  const [isFitnessModalOpen, setIsFitnessModalOpen] = useState(false);
  const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: userData?.username || "Guest",
    height: userData?.profile?.height || "",
    weight: userData?.profile?.weight || "",
    gender: userData?.profile?.gender || "",
    age: userData?.profile?.age || "",
    profilePic: userData?.profile?.profilePic || "/static/images/avatar/1.jpg",
  });
  const [editProfile, setEditProfile] = useState({ ...profile });
  const [profilePicFile, setProfilePicFile] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const handleEditProfileOpen = () => {
    setEditProfile({ ...profile });
    setIsEditProfileModalOpen(true);
  };

  const handleEditProfileClose = () => {
    setIsEditProfileModalOpen(false);
  };

  const handleEditProfileChange = (e) => {
    const { name, value } = e.target;
    setEditProfile({ ...editProfile, [name]: value });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProfile({ ...editProfile, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditProfileSubmit = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const formData = new FormData();
      formData.append("name", editProfile.name);
      formData.append("height", editProfile.height);
      formData.append("weight", editProfile.weight);
      formData.append("gender", editProfile.gender);
      formData.append("age", editProfile.age);
      if (profilePicFile) {
        formData.append("profilePic", profilePicFile);
      }

      const response = await axios.put(
        "http://127.0.0.1:8000/api/profile/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfile({ ...editProfile });
      setIsEditProfileModalOpen(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Profile Update Error:", err.response?.data);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const services = [
    {
      title: "Fitness",
      icon: <FitnessCenterIcon sx={{ fontSize: 50, color: "#fff" }} />,
      description: "Personalized workout routines.",
      bgColor: "#6C63FF", // Modern purple
      count: 5,
      total: 10,
      formType: "fitness",
    },
    {
      title: "Nutrition",
      icon: <RestaurantIcon sx={{ fontSize: 50, color: "#fff" }} />,
      description: "Balanced meal plans for optimal health.",
      bgColor: "#00BFA6", // Vibrant teal
      count: 4,
      total: 6,
      formType: "nutrition",
    },
    {
      title: "Yoga",
      icon: <SelfImprovementIcon sx={{ fontSize: 50, color: "#fff" }} />,
      description: "Strengthen your body and calm mind.",
      bgColor: "#FF6B6B", // Vibrant red
      count: 2,
      total: 5,
    },
    {
      title: "Meditation",
      icon: <SpaIcon sx={{ fontSize: 50, color: "#fff" }} />,
      description: "Reduce stress and improve focus.",
      bgColor: "#A18CD1", // Soft purple
      count: 6,
      total: 8,
      path: "/mindful-moments",
    },
  ];

  const handleOpenModal = (formType, path) => {
    if (formType === "fitness") {
      setIsFitnessModalOpen(true);
    } else if (formType === "nutrition") {
      setIsNutritionModalOpen(true);
    } else if (path) {
      navigate(path);
    }
  };

  const handleCloseModal = (formType) => {
    if (formType === "fitness") {
      setIsFitnessModalOpen(false);
    } else if (formType === "nutrition") {
      setIsNutritionModalOpen(false);
    }
  };

  const handleFitnessSubmit = (data) => {
    setFitnessOutput(data);
    setIsFitnessModalOpen(false);
  };

  const handleNutritionSubmit = (data) => {
    setNutritionOutput(data);
    setIsNutritionModalOpen(false);
  };

  const sidebarItems = [
    { text: "Home", icon: <HomeIcon />, path: "/" },
    { text: "My Goals", icon: <FitnessCenterIcon />, path: "/goals" },
    { text: "Schedule", icon: <EventIcon />, path: "/schedule" },
    { text: "Achievements", icon: <EmojiEventsIcon />, path: "/achievements" },
    { text: "Statistics", icon: <AssessmentIcon />, path: "/statistics" },
    { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
    { text: "Community", icon: <CommunityIcon />, path: "/community" },
  ];

  const formattedFitnessOutput = fitnessOutput
    ? JSON.stringify(fitnessOutput, null, 2)
    : null;
  const formattedNutritionOutput = nutritionOutput
    ? JSON.stringify(nutritionOutput, null, 2)
    : null;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: backgroundColor }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            border: "none",
            background: "linear-gradient(195deg,rgb(28, 1, 58),rgb(40, 20, 58))", // Dark gradient
            color: "#fff", // White text
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgb(255, 255, 255)", // Light scrollbar thumb
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
            background: "linear-gradient(195deg,rgb(55, 4, 85),rgb(6, 6, 6))", // Gradient for the header
            boxShadow: "0 4px 6px rgba(45, 6, 89, 0.2)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#fff", // White text
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
            }}
          >
            FitFlow
          </Typography>
        </Toolbar>

        {/* Profile Section */}
        {isLoggedIn && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 3,
              mb: 2,
              p: 2,
              borderRadius: "12px",
              background: "rgba(0, 0, 0, 0.1)", // Glass-morphism effect
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              width: "100%",
              maxWidth: "260px",
              textAlign: "center",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            <Box sx={{ position: "relative" }}>
              <Avatar
                alt={profile.name}
                src={profile.profilePic}
                sx={{
                  width: 90,
                  height: 90,
                  mb: 1,
                  border: "3px solid rgb(244, 243, 248)", // Modern purple border
                  backgroundColor: "#6C63FF", // Modern purple background
                  color: "#fff", // White text
                  fontSize: "2rem",
                  fontWeight: "bold",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              >
                {profile.name.charAt(0).toUpperCase()}
              </Avatar>
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  color: "#fff", // White icon
                  backgroundColor: primaryColor,
                  transition: "background-color 0.2s, transform 0.2s",
                  "&:hover": {
                    backgroundColor: secondaryColor,
                    transform: "scale(1.1)",
                  },
                }}
                onClick={handleEditProfileOpen}
                aria-label="edit profile"
              >
                <EditIcon />
              </IconButton>
            </Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", mt: 1, color: "#fff" }} // White text
            >
              {profile.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{ mt: 1, color: "rgba(252, 250, 250, 0.8)" }}
            >
              Height: {profile.height} cm
            </Typography>
            <Typography
              variant="body2"
              sx={{ mt: 1, color: "rgba(255, 255, 255, 0.8)" }}
            >
              Weight: {profile.weight} kg
            </Typography>
            <Typography
              variant="body2"
              sx={{ mt: 1, color: "rgba(255, 255, 255, 0.8)" }}
            >
              Gender: {profile.gender}
            </Typography>
            <Typography
              variant="body2"
              sx={{ mt: 1, color: "rgba(255, 255, 255, 0.8)" }}
            >
              Age: {profile.age}
            </Typography>
          </Box>
        )}

        {/* Navigation List */}
        <List sx={{ mt: 2 }}>
          {sidebarItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                py: 1.5,
                transition: "background-color 0.2s, transform 0.2s",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.1)", // Semi-transparent white
                  transform: "translateX(8px)",
                  "& .MuiListItemText-primary": {
                    color: "#6C63FF", // Modern purple text
                  },
                  "& .MuiListItemIcon-root": {
                    color: "#6C63FF", // Modern purple icon
                  },
                },
                "&.Mui-selected": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)", // Semi-transparent white
                  "& .MuiListItemText-primary": {
                    color: "#6C63FF", // Modern purple text
                  },
                  "& .MuiListItemIcon-root": {
                    color: "#6C63FF", // Modern purple icon
                  },
                },
              }}
              selected={location.pathname === item.path}
            >
              <ListItemIcon
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  transition: "color 0.2s",
                }}
              >
                {React.cloneElement(item.icon, { sx: { fontSize: "1.5rem" } })}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontWeight: "500",
                  transition: "color 0.2s",
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <AppBar
          position="static"
          sx={{
            backgroundColor: darkMode ? "#121212" : "#fff",
            color: textColor,
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            borderRadius: "8px",
          }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold", color: primaryColor }}>
              FitFlow Dashboard
            </Typography>
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
            <IconButton color="inherit" onClick={toggleDarkMode}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: textColor }}>
            Today's Focus
          </Typography>

          {/* Service Cards - Horizontal Scroll */}
          <Box
            sx={{
              display: "flex",
              overflowX: "auto",
              scrollBehavior: "smooth",
              pb: 2,
              "&::-webkit-scrollbar": {
                display: "none",
              },
              msOverflowStyle: "none", // Correct camelCase
              scrollbarWidth: "none", // Correct camelCase
            }}
          >
            {services.map((service, index) => (
              <Card
                key={service.title}
                sx={{
                  mr: 2,
                  borderRadius: "12px",
                  overflow: "hidden",
                  backgroundColor: service.bgColor, // Solid background color
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  height: cardHeight,
                  width: cardWidth,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                  },
                  flexShrink: 0,
                  cursor: "pointer",
                }}
                onClick={() => handleOpenModal(service.formType, service.path)}
              >
                <CardContent
                  sx={{
                    p: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Box sx={{ textAlign: "left", width: "70%" }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                      {service.description}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 1, fontSize: "0.8rem" }}>
                      {service.count} / {service.total} Completed
                    </Typography>
                  </Box>
                  <Box sx={{ width: "30%", textAlign: "right" }}>
                    <IconButton sx={{ color: "white", padding: "8px" }}>
                      {service.icon}
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Floating Action Button (FAB) */}
        <Fab
          color="primary"
          sx={{ position: "fixed", bottom: 16, right: 16, bgcolor: primaryColor }}
          onClick={() => alert("Add new item")}
        >
          <AddIcon />
        </Fab>

        {/* Fitness Modal */}
        <Modal
          open={isFitnessModalOpen}
          onClose={() => handleCloseModal("fitness")}
          aria-labelledby="fitness-modal-title"
          aria-describedby="fitness-modal-description"
        >
          <Box sx={paperStyle}>
            <Box sx={modalContentStyle}>
              <Typography id="fitness-modal-title" variant="h6" component="h2" sx={{ color: primaryColor, fontWeight: "bold", mb: 2 }}>
                Fitness Form
              </Typography>
              <FitnessForm onSubmit={handleFitnessSubmit} />
            </Box>
          </Box>
        </Modal>

        {/* Nutrition Modal */}
        <Modal
          open={isNutritionModalOpen}
          onClose={() => handleCloseModal("nutrition")}
          aria-labelledby="nutrition-modal-title"
          aria-describedby="nutrition-modal-description"
        >
          <Box sx={paperStyle}>
            <Box sx={modalContentStyle}>
              <Typography id="nutrition-modal-title" variant="h6" component="h2" sx={{ color: primaryColor, fontWeight: "bold", mb: 2 }}>
                Nutrition Form
              </Typography>
              <NutritionForm onSubmit={handleNutritionSubmit} />
            </Box>
          </Box>
        </Modal>

        {/* Edit Profile Modal */}
        <Modal open={isEditProfileModalOpen} onClose={handleEditProfileClose}>
          <Box sx={paperStyle}>
            <Box sx={modalContentStyle}>
              <Typography variant="h6" component="h2" sx={{ color: primaryColor, fontWeight: "bold", mb: 2 }}>
                Edit Profile
              </Typography>
              <TextField
                label="Name"
                name="name"
                value={editProfile.name}
                onChange={handleEditProfileChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Height (cm)"
                name="height"
                value={editProfile.height}
                onChange={handleEditProfileChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Weight (kg)"
                name="weight"
                value={editProfile.weight}
                onChange={handleEditProfileChange}
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={editProfile.gender}
                  onChange={handleEditProfileChange}
                  label="Gender"
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Age"
                name="age"
                value={editProfile.age}
                onChange={handleEditProfileChange}
                fullWidth
                margin="normal"
              />
              <Box sx={{ mt: 2 }}>
                <InputLabel>Profile Picture</InputLabel>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                />
              </Box>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={handleEditProfileClose} sx={{ mr: 1 }}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleEditProfileSubmit}>
                  Save
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>

        {/* Display Output (Fitness and Nutrition) */}
        <Box sx={{ mt: 4 }}>
          {formattedFitnessOutput && (
            <Card sx={{ mb: 2, p: 2, borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
              <Typography variant="h6" sx={{ color: primaryColor, fontWeight: "bold", mb: 1 }}>Fitness Recommendation:</Typography>
              <Box sx={{ maxHeight: "500px", overflow: "auto" }}>
                <pre style={{ whiteSpace: 'pre-wrap' }}>{formattedFitnessOutput}</pre>
              </Box>
            </Card>
          )}

          {formattedNutritionOutput && (
            <Card sx={{ p: 2, borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
              <Typography variant="h6" sx={{ color: primaryColor, fontWeight: "bold", mb: 1 }}>Nutrition Recommendation:</Typography>
              <Box sx={{ maxHeight: "500px", overflow: "auto" }}>
                <pre style={{ whiteSpace: 'pre-wrap' }}>{formattedNutritionOutput}</pre>
              </Box>
            </Card>
          )}
        </Box>

        {/* Statistics Section */}
        <Card sx={{ borderRadius: "12px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: textColor }}>
              Last Month's Progress
            </Typography>
            <LineChart width={730} height={300} data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 12 }} />
              <YAxis tick={{ fill: textColor, fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: darkMode ? "#333" : "#fff", border: "1px solid #ccc", borderRadius: "4px" }}
                labelStyle={{ fontWeight: "bold", color: textColor }} itemStyle={{ color: textColor }} />
              <Legend iconType="circle" wrapperStyle={{ top: 0, right: 0 }} />
              <Line type="monotone" dataKey="Exercises" stroke="#ADD8E6" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="Meals" stroke="#FF4136" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default Services;