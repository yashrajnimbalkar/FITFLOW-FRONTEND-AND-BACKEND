import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Typography, Box, Avatar } from "@mui/material";
import { motion } from "framer-motion";

const CommentSection = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("access_token");

    // Fetch comments
    useEffect(() => {
        if (!token) {
            alert("You need to be logged in to view comments.");
            return;
        }

        const fetchComments = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(
                    `http://localhost:8000/api/community/posts/${postId}/comments/`, // Use backticks for template literals
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Use backticks for template literals
                        },
                    }
                );
                setComments(response.data);
            } catch (error) {
                console.error("Error fetching comments:", error.response?.data || error.message);
                setError("Failed to fetch comments.");
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [postId, token]);

    // Handle adding a new comment
    const handleAddComment = async () => {
        if (!newComment.trim()) {
            alert("Comment cannot be empty!");
            return;
        }

        if (!token) {
            alert("You need to be logged in to add a comment.");
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8000/api/community/posts/${postId}/comments/`, // Use backticks for template literals
                { text: newComment },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Use backticks for template literals
                    },
                }
            );

            setComments([...comments, response.data]);
            setNewComment("");
        } catch (error) {
            console.error("Error adding comment:", error.response?.data || error.message);
            alert("Failed to add comment.");
        }
    };

    return (
        <Box
            sx={{
                mt: 2,
                p: 2,
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                background: "#ffffff",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
        >
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#262626", mb: 2 }}>
                Comments
            </Typography>
            {loading && <Typography>Loading comments...</Typography>}
            {error && <Typography color="error">{error}</Typography>}
            {comments.length > 0 ? (
                comments.map((comment) => (
                    <Box
                        key={comment.id}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 1,
                            p: 1,
                            borderBottom: "1px solid #eee",
                        }}
                    >
                        <Avatar
                            src={comment.user.profile_picture || ""}
                            alt={comment.user.username}
                            sx={{ width: 32, height: 32 }}
                        />
                        <Typography variant="body2" sx={{ color: "#262626" }}>
                            <strong>@{comment.user.username}</strong>: {comment.text}
                        </Typography>
                    </Box>
                ))
            ) : (
                <Typography variant="body2" sx={{ color: "#888" }}>
                    No comments yet.
                </Typography>
            )}

            <TextField
                fullWidth
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                multiline
                rows={2}
                sx={{
                    mt: 2,
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        borderColor: "#e0e0e0",
                        "&:hover fieldset": {
                            borderColor: "#bdbdbd",
                        },
                    },
                }}
            />
            <Button
                onClick={handleAddComment}
                variant="contained"
                sx={{
                    mt: 1,
                    borderRadius: "8px",
                    textTransform: "none",
                    background: "linear-gradient(145deg, #405de6, #833ab4)",
                    color: "#ffffff",
                    "&:hover": {
                        background: "linear-gradient(145deg, #374ec7, #6a2d9a)",
                    },
                }}
            >
                Add Comment
            </Button>
        </Box>
    );
};

export default CommentSection;