import React from "react";
import { Card, CardContent, Typography, Box, Avatar, IconButton } from "@mui/material";
import { Favorite, FavoriteBorder, Comment } from "@mui/icons-material";
import { motion } from "framer-motion";

const Feed = ({ posts, onLikePost }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, padding: 2 }}>
      {posts.map((post) => (
        <motion.div
          key={post.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
              background: "#ffffff",
              overflow: "hidden",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                boxShadow: "0 12px 32px rgba(0, 0, 0, 0.2)",
              },
              width: "100%", // Ensure the card takes full width
              maxWidth: "1200px", // Increase the maximum width of the card
              margin: "0 auto", // Center the card
            }}
          >
            <CardContent>
              {/* Post Header */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Avatar
                  src={post.user.profile_picture || ""}
                  alt={post.user.username}
                  sx={{ width: 56, height: 56, border: "2px solid #e0e0e0" }} // Increase avatar size
                />
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#262626" }}>
                  @{post.user.username}
                </Typography>
              </Box>

              {/* Post Text */}
              <Typography variant="body1" sx={{ color: "#262626", mb: 3, fontSize: "1.1rem" }}>
                {post.text}
              </Typography>

              {/* Post Image or Video */}
              {post.image && (
                <img
                  src={post.image}
                  alt="Post"
                  style={{
                    width: "100%",
                    borderRadius: "12px",
                    marginBottom: "16px",
                    objectFit: "cover",
                    maxHeight: "500px", // Increase the height of the image
                  }}
                />
              )}
              {post.video && (
                <video
                  controls
                  src={post.video}
                  style={{
                    width: "100%",
                    borderRadius: "12px",
                    marginBottom: "16px",
                    maxHeight: "500px", // Increase the height of the video
                  }}
                />
              )}

              {/* Like and Comment Buttons */}
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                <Box>
                  <IconButton
                    onClick={() => onLikePost(post.id)}
                    sx={{
                      color: post.is_liked ? "#ff4081" : "#bdbdbd",
                      "&:hover": { color: "#ff4081" },
                    }}
                  >
                    {post.is_liked ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                  <Typography variant="body2" sx={{ display: "inline", ml: 1, color: "#262626", fontSize: "1rem" }}>
                    {post.likes.length} Likes
                  </Typography>

                  <IconButton
                    sx={{
                      color: "#bdbdbd",
                      "&:hover": { color: "#405de6" },
                    }}
                  >
                    <Comment />
                  </IconButton>
                  <Typography variant="body2" sx={{ display: "inline", ml: 1, color: "#262626", fontSize: "1rem" }}>
                    {post.comments.length} Comments
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </Box>
  );
};

export default Feed;