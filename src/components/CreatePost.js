import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { PhotoCamera, Videocam, Close, Delete } from "@mui/icons-material";
import axios from "axios";

const CreatePost = ({ open, onClose, onCreate }) => {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("fitness");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to refresh the access token
  const refreshToken = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/token/refresh/", {
        refresh: localStorage.getItem("refresh_token"),
      });
      localStorage.setItem("access_token", response.data.access);
      return response.data.access;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      setError("Session expired. Please log in again.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!text.trim() && !image && !video) {
      setError("Please enter text or upload media.");
      return;
    }

    const formData = new FormData();
    formData.append("text", text);
    formData.append("category", category);
    if (image) formData.append("image", image);
    if (video) formData.append("video", video);

    setLoading(true);
    try {
      let token = localStorage.getItem("access_token");

      // Check if the token is expired and refresh it if necessary
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expiry = payload.exp * 1000;
        if (Date.now() > expiry) {
          token = await refreshToken();
          if (!token) {
            setLoading(false);
            return;
          }
        }
      }

      // Make the POST request to create the post
      await axios.post("http://localhost:8000/api/community/posts/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setLoading(false);
      alert("Post created successfully!");
      onCreate(); // Refresh the feed
      onClose(); // Close the modal
      setText("");
      setImage(null);
      setVideo(null);
    } catch (error) {
      setLoading(false);
      console.error("Error creating post:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setError("Failed to create post. Please try again.");
      }
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setVideo(null); // Clear video if an image is uploaded
    }
  };

  // Handle video upload
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setImage(null); // Clear image if a video is uploaded
    }
  };

  // Clear uploaded media
  const handleClearMedia = () => {
    setImage(null);
    setVideo(null);
  };

  // Close the error snackbar
  const handleCloseError = () => {
    setError("");
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 500 },
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,
          borderRadius: "12px",
          outline: "none",
          maxHeight: "90vh",
          overflow: "auto",
          background: "linear-gradient(145deg, #f9f9f9, #ffffff)",
          border: "1px solid #e0e0e0",
          "&:focus": { outline: "none" },
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#262626" }}>
            Create a New Post
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "#262626" }}>
            <Close />
          </IconButton>
        </Box>

        {/* Text Input */}
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your post..."
          fullWidth
          multiline
          rows={4}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              borderColor: "#e0e0e0",
              "&:hover fieldset": {
                borderColor: "#bdbdbd",
              },
            },
            "& .MuiInputBase-input": {
              color: "#262626",
            },
          }}
        />

        {/* Category Dropdown */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel sx={{ color: "#262626" }}>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
            sx={{
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                borderColor: "#e0e0e0",
                "&:hover fieldset": {
                  borderColor: "#bdbdbd",
                },
              },
              "& .MuiSelect-select": {
                color: "#262626",
              },
            }}
          >
            <MenuItem value="fitness">Fitness</MenuItem>
            <MenuItem value="nutrition">Nutrition</MenuItem>
            <MenuItem value="yoga">Yoga</MenuItem>
            <MenuItem value="mental_health">Mental Health</MenuItem>
            <MenuItem value="recipes">Recipes</MenuItem>
            <MenuItem value="motivation">Motivation</MenuItem>
            <MenuItem value="qna">Q&A</MenuItem>
            <MenuItem value="challenges">Challenges</MenuItem>
          </Select>
        </FormControl>

        {/* Media Upload Buttons */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <IconButton
            component="label"
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              p: 1.5,
              background: "linear-gradient(145deg, #f5f5f5, #ffffff)",
              "&:hover": { background: "#f0f0f0" },
            }}
            title="Add Image"
          >
            <PhotoCamera sx={{ color: "#262626" }} />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </IconButton>
          <IconButton
            component="label"
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              p: 1.5,
              background: "linear-gradient(145deg, #f5f5f5, #ffffff)",
              "&:hover": { background: "#f0f0f0" },
            }}
            title="Add Video"
          >
            <Videocam sx={{ color: "#262626" }} />
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              style={{ display: "none" }}
            />
          </IconButton>
        </Box>

        {/* Media Previews */}
        {(image || video) && (
          <Box sx={{ mb: 2, position: "relative" }}>
            <IconButton
              onClick={handleClearMedia}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "#fff",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
              }}
              aria-label="Clear Media"
            >
              <Delete />
            </IconButton>
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Uploaded"
                style={{
                  maxWidth: "100%",
                  borderRadius: "8px",
                  maxHeight: "200px",
                  objectFit: "cover",
                }}
              />
            )}
            {video && (
              <video
                controls
                src={URL.createObjectURL(video)}
                style={{ maxWidth: "100%", borderRadius: "8px" }}
              />
            )}
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              color: "#262626",
              borderColor: "#e0e0e0",
              background: "linear-gradient(145deg, #f5f5f5, #ffffff)",
              "&:hover": { background: "#f0f0f0" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              background: "linear-gradient(145deg, #405de6, #833ab4)",
              color: "#ffffff",
              "&:hover": { background: "linear-gradient(145deg, #374ec7, #6a2d9a)" },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Create Post"}
          </Button>
        </Box>

        {/* Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseError}
          message={error}
          sx={{
            "& .MuiSnackbarContent-root": {
              backgroundColor: "#d32f2f",
              color: "#fff",
            },
          }}
        />
      </Box>
    </Modal>
  );
};

export default CreatePost;