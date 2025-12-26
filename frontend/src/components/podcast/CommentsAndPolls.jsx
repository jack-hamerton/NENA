
import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/theme';
import { Menu, MenuItem, Button } from '@mui/material';
import { rewriteText } from '../../services/aiService';

const CommentsAndPollsContainer = styled.div`
  background: ${theme.palette.dark};
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 2rem;
  width: 100%;
`;

const CommentInput = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid ${theme.palette.primary};
  background: ${theme.palette.dark};
  color: ${theme.text.primary};
  min-height: 50px;
  margin-bottom: 1rem;
`;

const CommentButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  background: ${theme.palette.accent};
  color: white;
  cursor: pointer;
  margin-bottom: 1rem;

  &:hover {
    background: ${theme.palette.secondary};
  }
`;

const PollContainer = styled.div`
  margin-top: 1rem;
`;

const PollQuestion = styled.h4`
  margin-bottom: 0.5rem;
  color: ${theme.text.primary};
`;

const PollOption = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: ${theme.text.secondary};
`;

const CommentThread = styled.div`
  margin-top: 1rem;
`;

const CommentItem = styled.div`
  padding: 0.5rem;
  border-left: 2px solid ${theme.palette.primary};
  margin-left: ${props => props.level * 20}px;
  margin-bottom: 0.5rem;
  color: ${theme.text.primary};
`;

const ReplyButton = styled.button`
    background: none;
    border: none;
    color: ${theme.palette.accent};
    cursor: pointer;
    padding: 0;
    font-size: 0.8rem;
`;

const VoteButton = styled.button`
    background: ${theme.palette.accent};
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
`;

const CommentsAndPolls = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [isReply, setIsReply] = useState(false);


  const findCommentAndAddReply = (comments, parentId, newReply) => {
    return comments.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...comment.replies, newReply],
        };
      }
      if (comment.replies.length > 0) {
        return {
          ...comment,
          replies: findCommentAndAddReply(comment.replies, parentId, newReply),
        };
      }
      return comment;
    });
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        id: Date.now(),
        text: newComment,
        replies: [],
      };
      setComments([...comments, newCommentObj]);
      setNewComment('');
    }
  };
  
  const handleReplySubmit = (parentId) => {
    if (replyText.trim()) {
        const newReply = {
            id: Date.now(),
            text: replyText,
            replies: [],
        };
        const updatedComments = findCommentAndAddReply(comments, parentId, newReply);
        setComments(updatedComments);
        setReplyingTo(null);
        setReplyText('');
    }
  };

  const handleAiAssistClick = (event, isReply) => {
    setAnchorEl(event.currentTarget);
    setIsReply(isReply);
  };

  const handleAiAssistClose = () => {
    setAnchorEl(null);
  };

  const handleRewrite = async (tone) => {
    const textToRewrite = isReply ? replyText : newComment;
    const rewrittenText = await rewriteText(textToRewrite, tone);
    if (isReply) {
      setReplyText(rewrittenText);
    } else {
      setNewComment(rewrittenText);
    }
    handleAiAssistClose();
  };


  const renderComments = (commentList, level = 0) => {
    return commentList.map(comment => (
      <CommentItem key={comment.id} level={level}>
        <p>{comment.text}</p>
        <ReplyButton onClick={() => setReplyingTo(comment.id)}>Reply</ReplyButton>
        {replyingTo === comment.id && (
          <div>
            <CommentInput
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
            />
            <CommentButton onClick={() => handleReplySubmit(comment.id)}>Submit Reply</CommentButton>
            <Button
              aria-controls="ai-assist-menu"
              aria-haspopup="true"
              onClick={(e) => handleAiAssistClick(e, true)}
              variant="outlined"
              sx={{ mt: 1, ml: 1 }}
            >
              AI Assist
            </Button>
          </div>
        )}
        {comment.replies.length > 0 && (
          <CommentThread>
            {renderComments(comment.replies, level + 1)}
          </CommentThread>
        )}
      </CommentItem>
    ));
  };

  const [poll, setPoll] = useState({
    question: 'What is your favorite podcast genre?',
    options: ['Comedy', 'True Crime', 'News', 'Technology'],
    votes: {},
  });

  const handleVote = (option) => {
    const newVotes = { ...poll.votes };
    newVotes[option] = (newVotes[option] || 0) + 1;
    setPoll({ ...poll, votes: newVotes });
  };

  return (
    <CommentsAndPollsContainer>
      <h3 style={{ color: theme.text.primary }}>Comments & Polls</h3>
      <div>
        <CommentInput
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Leave a comment..."
        />
        <CommentButton onClick={handleCommentSubmit}>Comment</CommentButton>
        <Button
          aria-controls="ai-assist-menu"
          aria-haspopup="true"
          onClick={(e) => handleAiAssistClick(e, false)}
          variant="outlined"
          sx={{ mt: 1, ml: 1 }}
        >
          AI Assist
        </Button>
      </div>
      <Menu
        id="ai-assist-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleAiAssistClose}
      >
        <MenuItem onClick={() => handleRewrite('formal')}>Formal</MenuItem>
        <MenuItem onClick={() => handleRewrite('friendly')}>Friendly</MenuItem>
        <MenuItem onClick={() => handleRewrite('respectful')}>Respectful</MenuItem>
        <MenuItem onClick={() => handleRewrite('concise')}>Concise</MenuItem>
      </Menu>
      <CommentThread>{renderComments(comments)}</CommentThread>
      <PollContainer>
        <PollQuestion>{poll.question}</PollQuestion>
        {poll.options.map((option, index) => (
          <PollOption key={index}>
            <VoteButton onClick={() => handleVote(option)}>Vote</VoteButton>
            <span>{option} ({poll.votes[option] || 0})</span>
          </PollOption>
        ))}
      </PollContainer>
    </CommentsAndPollsContainer>
  );
};

export default CommentsAndPolls;
