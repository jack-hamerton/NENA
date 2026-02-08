
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, Tabs, Tab, IconButton, Switch, FormGroup, FormControlLabel, LinearProgress, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

// Assume the logged-in user has ID 1 for this example
const currentUserId = 1;

// --- Simulated Backend API ---
// Replace these functions with your actual backend calls.
const campaignApi = {
  getCampaignByName: async (name) => {
    console.log(`Fetching data for campaign: ${name}...`);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

    const mockData = {
      KiberaSafePassage: {
        title: "Secure Our Streets: #KiberaSafePassage",
        mission: "We are demanding the installation of 50 new solar-powered streetlights along the main walkway to ensure safe passage for all residents after dark.",
        creatorId: 1,
        links: { room: { url: '/room/kibera-safe-passage-123', enabled: true }, messages: { url: '/messages/campaign-kibera-general', enabled: true } },
        plan: [{ text: "Collect 500 signatures for our online petition.", completed: true }, { text: "Secure a meeting with the local County official.", completed: false }, { text: "Host a community town hall meeting.", completed: false }],
        challenges: [{ title: "Fundraising Challenge", description: "Raise $5,000 for the solar panels to cover initial installation costs.", progress: 0.6, goal: 5000, current: 3000, unit: '$' }, { title: "Petition Signatures", description: "Gather 500 signatures from local residents to present to the county official.", progress: 1.0, goal: 500, current: 712, unit: 'signatures' }],
        updates: ["Great news! Our meeting with the MCA has been scheduled for next Tuesday.", "We've reached over 700 signatures! The community's voice is strong."],
        supporters: 1245,
        stories: 87,
      }
    };

    if (mockData[name]) {
      return mockData[name];
    }
    throw new Error("Campaign not found.");
  },
  updateLinkSettings: async (campaignName, linkType, isEnabled) => {
    console.log(`Updating ${linkType} for ${campaignName} to ${isEnabled}...`);
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real API, you'd get a success/fail response.
    console.log("Update successful.");
    return { success: true };
  }
};
// --- End of Simulated API ---

const CampaignHubModal = ({ campaignName, open, onClose }) => {
  const [tabValue, setTabValue] = useState('1');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open && campaignName) {
      const fetchCampaignData = async () => {
        setLoading(true);
        setError(null);
        setData(null);
        try {
          const campaignData = await campaignApi.getCampaignByName(campaignName);
          setData(campaignData);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchCampaignData();
      setTabValue('1'); // Reset to the first tab on open
    }
  }, [open, campaignName]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLinkToggle = async (linkType) => {
    const originalState = data.links[linkType].enabled;
    // Optimistic UI update
    setData(prevData => ({
        ...prevData,
        links: { ...prevData.links, [linkType]: { ...prevData.links[linkType], enabled: !originalState } }
    }));

    try {
      await campaignApi.updateLinkSettings(campaignName, linkType, !originalState);
    } catch (err) {
      console.error("Failed to update link settings:", err);
      // Revert on error
      setData(prevData => ({
          ...prevData,
          links: { ...prevData.links, [linkType]: { ...prevData.links[linkType], enabled: originalState } }
      }));
    }
  };

  const handleRedirect = (url) => {
    onClose();
    navigate(url);
  };

  const isCreator = data?.creatorId === currentUserId;

  const renderContent = () => {
    if (loading) {
      return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>;
    }
    if (error) {
      return <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>Error: {error}</Typography>;
    }
    if (!data) {
      return null; // Or a placeholder
    }

    return (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>{data.title}</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>
        <Typography variant="body1" sx={{ mb: 2 }}>{data.mission}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Box><Typography variant="body2"><strong>{data.supporters}</strong> Supporters</Typography><Typography variant="body2"><strong>{data.stories}</strong> Impact Stories</Typography></Box>
          <Button variant="contained" color="primary">+ Support Campaign</Button>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', mb: 2, gap: 1, borderTop: 1, borderBottom: 1, borderColor: 'divider', py: 1 }}>
          <Button variant="outlined" disabled={!data.links?.room?.enabled} onClick={() => handleRedirect(data.links.room.url)}>Go to Room</Button>
          <Button variant="outlined" disabled={!data.links?.messages?.enabled} onClick={() => handleRedirect(data.links.messages.url)}>Go to Messages</Button>
        </Box>
        <Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              <Tab label="The Plan" value="1" />
              <Tab label="Challenges" value="2" />
              <Tab label="Updates" value="3" />
              <Tab label="Supporters" value="4" />
              {isCreator && <Tab label="Settings" value="5" />}
            </Tabs>
          </Box>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 2 }}>
            {tabValue === '1' && (
              <Box sx={{ p: 0 }}>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {data.plan?.map((item, index) => (
                    <li key={index} style={{ textDecoration: item.completed ? 'line-through' : 'none', marginBottom: '8px' }}>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </Box>
            )}
            {tabValue === '2' && (
              <Box sx={{ p: 0 }}>
                {data.challenges?.map((challenge, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6">{challenge.title}</Typography>
                      <Typography variant="caption">
                        {challenge.unit === '$' ? '$' : ''}
                        {challenge.current.toLocaleString()}/{challenge.goal.toLocaleString()} {challenge.unit !== '$' ? challenge.unit : ''}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {challenge.description}
                    </Typography>
                    <LinearProgress variant="determinate" value={challenge.progress * 100} sx={{ height: '8px', borderRadius: '4px' }} />
                  </Box>
                ))}
              </Box>
            )}
            {tabValue === '3' && (
              <Box sx={{ p: 0 }}>
                {data.updates?.map((update, index) => (
                  <Typography key={index} paragraph>
                    {update}
                  </Typography>
                ))}
              </Box>
            )}
            {tabValue === '4' && (
              <Box sx={{ p: 0 }}>
                <Typography>A grid of supporter profiles will be shown here.</Typography>
              </Box>
            )}
            {isCreator && tabValue === '5' && (
              <Box sx={{ p: 0 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Campaign Settings
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={<Switch color="primary" checked={data.links?.room?.enabled} onChange={() => handleLinkToggle('room')} />}
                    label="Enable Room Link"
                  />
                  <FormControlLabel
                    control={<Switch color="primary" checked={data.links?.messages?.enabled} onChange={() => handleLinkToggle('messages')} />}
                    label="Enable Messages Link"
                  />
                </FormGroup>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Disabling a link will prevent supporters from accessing it directly from this hub.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </>
    );
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="campaign-hub-modal">
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '85vh', backgroundColor: 'background.paper', borderTopLeftRadius: 16, borderTopRightRadius: 16, boxShadow: 24, p: 2, display: 'flex', flexDirection: 'column' }}>
        {renderContent()}
      </Box>
    </Modal>
  );
};

export default CampaignHubModal;
