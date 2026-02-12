
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/theme';
import { Menu, MenuItem, Button, CircularProgress, Typography } from '@mui/material';
import { rewriteText } from '../../services/aiService';
import { getComments, createComment } from '../../services/comment.service';
import { getPolls, voteOnPoll } from '../../services/poll.service';

const CommentsAndPollsContainer = styled.div`
  background: ${theme.palette.background.paper};
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 2rem;
  width: 100%;
`;

const CommentInput = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid ${theme.palette.divider};
  background: ${theme.palette.background.default};
  color: ${theme.palette.text.primary};
  min-height: 50px;
  margin-bottom: 1rem;
`;

const CommentButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  background: ${theme.palette.primary.main};
  color: white;
  cursor: pointer;
  margin-bottom: 1rem;

  &:hover {
    background: ${theme.palette.primary.dark};
  }
`;

const PollContainer = styled.div`
  margin-top: 1rem;
`;

const PollQuestion = styled.h4`
  margin-bottom: 0.5rem;
  color: ${theme.palette.text.primary};
`;

const PollOption = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: ${theme.palette.text.secondary};
`;

const CommentThread = styled.div`
  margin-top: 1rem;
`;

const CommentItem = styled.div`
  padding: 0.5rem;
  border-left: 2px solid ${theme.palette.primary.main};
  margin-left: ${props => props.level * 20}px;
  margin-bottom: 0.5rem;
  color: ${theme.palette.text.primary};
`;

const ReplyButton = styled.button`
    background: none;
    border: none;
    color: ${theme.palette.primary.main};
    cursor: pointer;
    padding: 0;
    font-size: 0.8rem;
`;

const VoteButton = styled.button`
    background: ${theme.palette.primary.main};
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
`;

const CommentsAndPolls = ({ episodeId }) => {
  const [comments, setComments] = useState([]);
  const [polls, setPolls] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [isReply, setIsReply] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!episodeId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [commentsResponse, pollsResponse] = await Promise.all([
          getComments(episodeId),
          getPolls(episodeId),
        ]);
        setComments(commentsResponse.data);
        setPolls(pollsResponse.data);
      } catch (err) {
        setError('Error fetching comments and polls.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [episodeId]);

  const handleCommentSubmit = async () => {
    if (newComment.trim()) {
      try {
        const response = await createComment({ episodeId, text: newComment });
        setComments([...comments, response.data]);
        setNewComment('');
      } catch (error) {
        console.error('Error posting comment', error);
      }
    }
  };
  
  const handleReplySubmit = async (parentId) => {
    if (replyText.trim()) {
      try {
        const response = await createComment({ episodeId, text: replyText, parentId });
        // You would ideally update the comments state immutably here
        setReplyingTo(null);
        setReplyText('');
      } catch (error) {
        console.error('Error posting reply', error);
      }
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

  const handleVote = async (pollId, optionId) => {
    try {
      await voteOnPoll(pollId, optionId);
      // You might want to refresh the poll data here
    } catch (error) {
      console.error('Error voting on poll', error);
    }
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
        {comment.replies && comment.replies.length > 0 && (
          <CommentThread>
            {renderComments(comment.replies, level + 1)}
          </CommentThread>
        )}
      </CommentItem>
    ));
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <CommentsAndPollsContainer>
      <h3 style={{ color: theme.palette.text.primary }}>Comments & Polls</h3>
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
      {polls.map(poll => (
        <PollContainer key={poll.id}>
          <PollQuestion>{poll.question}</PollQuestion>
          {poll.options.map((option, index) => (
            <PollOption key={index}>
              <VoteButton onClick={() => handleVote(poll.id, option.id)}>Vote</VoteButton>
              <span>{option.text} ({option.votes || 0})</span>
            </PollOption>
          ))}
        </PollContainer>
      ))}
    </CommentsAndPollsContainer>
  );
};

export default CommentsAndPolls;
