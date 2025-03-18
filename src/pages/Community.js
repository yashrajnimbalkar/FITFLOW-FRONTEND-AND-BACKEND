import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar"; // Import the Sidebar component
import Feed from "../components/Feed";
import CreatePost from "../components/CreatePost";
import { Fab, CircularProgress, Snackbar } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/system";
import "./Community.css"; // Ensure this path is correct

const StyledFab = styled(Fab)({
  position: "fixed",
  bottom: "20px",
  right: "20px",
  backgroundColor: "#0095f6",
  "&:hover": {
    backgroundColor: "#0077cc",
  },
});

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("all");
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Fetch posts based on selected category
  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        alert("You need to be logged in to view posts.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const url =
          category === "all"
            ? `http://localhost:8000/api/community/posts/` // Use backticks for template literals
            : `http://localhost:8000/api/community/posts/?category=${category}`; // Use backticks for template literals

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`, // Use backticks for template literals
          },
        });

        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error.response?.data || error.message);
        setError("Failed to fetch posts. Please check your login status.");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category]);

  // Handle creating a new post
  const handleCreatePost = () => {
    setCreatePostOpen(true);
  };

  // Close the create post modal
  const handleCloseCreatePost = () => {
    setCreatePostOpen(false);
  };

  // Refresh the feed after creating a post
  const handlePostCreated = () => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        alert("You need to be logged in to view posts.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`http://localhost:8000/api/community/posts/`, {
          headers: {
            Authorization: `Bearer ${token}`, // Use backticks for template literals
          },
        });
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error.response?.data || error.message);
        setError("Failed to fetch posts.");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  };

  // Handle liking/unliking a post
  const handleLikePost = async (postId) => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("You need to be logged in to like/unlike posts.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8000/api/community/posts/${postId}/like/`, // Use backticks for template literals
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use backticks for template literals
          },
        }
      );

      // Refresh the posts to update the like count
      const updatedPosts = posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.likes.includes(postId)
                ? post.likes.filter((id) => id !== postId)
                : [...post.likes, postId],
            }
          : post
      );
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error liking/unliking post:", error.response?.data || error.message);
      alert("Failed to like/unlike post.");
    }
  };

  return (
    <div className="community-container">
      {/* Sidebar */}
      <Sidebar onCategorySelect={setCategory} onCreatePost={handleCreatePost} />

      {/* Feed */}
      <div className="feed">
        {loading && (
          <div className="loading">
            <CircularProgress />
          </div>
        )}
        {error && (
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            message={error}
          />
        )}
        <Feed posts={posts} onLikePost={handleLikePost} />
      </div>

      {/* Floating Action Button for Create Post */}
      <StyledFab color="primary" aria-label="add" onClick={handleCreatePost}>
        <AddIcon />
      </StyledFab>

      {/* Create Post Modal */}
      <CreatePost open={createPostOpen} onClose={handleCloseCreatePost} onCreate={handlePostCreated} />
    </div>
  );
};

export default Community;