import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const floatIn = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  min-height: 100vh;
  color: ${props => props.theme.text.primary};
  background:
    radial-gradient(900px 420px at 10% 10%, rgba(115, 190, 176, 0.18), transparent 60%),
    radial-gradient(700px 360px at 90% 15%, rgba(66, 121, 115, 0.25), transparent 55%),
    linear-gradient(180deg, #2b3741 0%, #2f3a44 55%, #27313a 100%);
  display: flex;
  flex-direction: column;
  font-family: 'Sora', 'Manrope', 'Segoe UI', sans-serif;
`;

const Shell = styled.div`
  width: min(1100px, 92vw);
  margin: 0 auto;
  padding: 32px 0 72px;
  display: flex;
  flex-direction: column;
  gap: 64px;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.08em;
`;

const NavActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const GhostLink = styled(Link)`
  color: ${props => props.theme.text.primary};
  text-decoration: none;
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.palette.secondary};
    color: ${props => props.theme.palette.secondary};
  }
`;

const SolidLink = styled(Link)`
  color: #0f1b20;
  text-decoration: none;
  padding: 10px 18px;
  border-radius: 999px;
  background: linear-gradient(120deg, ${props => props.theme.palette.secondary} 0%, #8ad6c8 100%);
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 12px 24px rgba(66, 121, 115, 0.28);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 16px 28px rgba(66, 121, 115, 0.36);
  }
`;

const Hero = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 36px;
  align-items: center;
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: ${floatIn} 0.8s ease-out;
`;

const Eyebrow = styled.span`
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-size: 0.75rem;
  color: ${props => props.theme.text.secondary};
`;

const Title = styled.h1`
  font-size: clamp(2.4rem, 4vw, 3.6rem);
  line-height: 1.05;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 1.05rem;
  color: ${props => props.theme.text.secondary};
  margin: 0;
`;

const CTA = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
`;

const HeroCard = styled.div`
  background: rgba(58, 71, 83, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 28px;
  backdrop-filter: blur(8px);
  animation: ${floatIn} 0.9s ease-out;
`;

const CardTitle = styled.h3`
  margin: 0 0 14px;
  font-size: 1.25rem;
`;

const List = styled.ul`
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 10px;
  color: ${props => props.theme.text.secondary};
`;

const Section = styled.section`
  display: grid;
  gap: 24px;
`;

const SectionHeader = styled.div`
  display: grid;
  gap: 8px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 1.8rem;
`;

const SectionSubtitle = styled.p`
  margin: 0;
  color: ${props => props.theme.text.secondary};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
`;

const InfoCard = styled.div`
  padding: 20px;
  border-radius: 16px;
  background: rgba(58, 71, 83, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

const InfoTitle = styled.h4`
  margin: 0 0 8px;
`;

const InfoText = styled.p`
  margin: 0;
  color: ${props => props.theme.text.secondary};
  font-size: 0.95rem;
`;

const Footer = styled.footer`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 24px;
  color: ${props => props.theme.text.secondary};
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
`;

const FooterLink = styled(Link)`
  color: ${props => props.theme.text.secondary};
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.palette.secondary};
  }
`;

const LandingPage = () => {
  return (
    <Page>
      <Shell>
        <Nav>
          <Logo>NENA</Logo>
          <NavActions>
            <GhostLink to="/login">Login</GhostLink>
            <SolidLink to="/signup">Get Started</SolidLink>
          </NavActions>
        </Nav>

        <Hero>
          <HeroContent>
            <Eyebrow>About NenaSpace</Eyebrow>
            <Title>Network for Empowerment Narrative & Advocacy Space.</Title>
            <Subtitle>
                In Kiswahili, the word “Nena” means talk. It is a simple word, yet it carries the heartbeat of our communities, the wisdom of elders under acacia trees, the laughter of children in marketplaces, the debates of youth in matatus, and the voices of activists calling for justice.
               Nena is social inclusive with data impact connection. Nena is a dialogue. It is more than a name; it is a promise. A promise to protect voices, to amplify stories, and to spark change through dialogue. Built in Kenya, built for Africa, and open to the world, Nena is a pioneering digital hub created to spark dialogue,
                amplify voices, and drive community impact, while remaining deeply rooted in cultural relevance and inclusivity. It offers a dynamic ecosystem where people can connect through podcasts, conferencing, study tools, and creative expression,
                all within a secure and accessible environment.
            </Subtitle>
            <CTA>
              <SolidLink to="/login">Log In</SolidLink>
              <GhostLink to="/signup">Create Account</GhostLink>
            </CTA>
          </HeroContent>
          <HeroCard>
            <CardTitle>What NenaSpace deliver</CardTitle>
            <List>
              <li>
                  AI-Powered Synthesis: Turn conversation into action. Our AI engine transcribes, analyzes, and summarizes community dialogue,
                 automatically generating actionable briefs and policy proposals in minutes, not weeks.
              </li>
              <li>
                A Digital Safe Harbor: Speak freely, act securely. With state-of-the-art end-to-end encryption, anonymized participation modes, and a "Privacy by Design" framework,
               Nena is a trusted space for sensitive and impactful work.
              </li>
              <li>
                A Unified Workspace: End the digital scramble. Nena brings your meetings, encrypted chats,
               and collaborative documents into one integrated hub, ensuring no valuable insight is lost between apps.
              </li>
              <li>
                The Impact Attribution Engine: Measure what matters. Nena's relational database connects dialogue to outcomes, providing the data-driven proof of impact that funders and communities demand,
               moving beyond vanity metrics to demonstrate real-world change.
              </li>
            </List>
          </HeroCard>
        </Hero>

        <Section>
          <SectionHeader>
            <SectionTitle>Our story</SectionTitle>
            <SectionSubtitle>
              In today's fragmented digital landscape, organizations and individuals dedicated to advocacy, social impact,
             and youth engagement face a critical challenge: a disconnect between conversation and action. Vital discussions happen across a myriad of platforms,
             but the momentum is often lost in the digital noise. The administrative burden of transcribing meetings, synthesizing feedback, and mobilizing community members is immense,
             hindering the very impact these organizations and individuals strive to create. Nena is  an Action-Oriented Community Platform. By fusing communication, collaboration,
             and artificial intelligence into a purpose-built workflow, this data underscores a critical gap: while NGOs and individuals are increasingly digital,
             they lack purpose-built platforms that translate dialogue into measurable action. Nena is uniquely positioned to fill this void.
            </SectionSubtitle>
          </SectionHeader>
          <Grid>
            <InfoCard>
              <InfoTitle>Mission</InfoTitle>
              <InfoText>
                A place where technology serves people, where privacy is not optional but foundational, and where inclusivity is woven into every feature.
               In a world where surveillance and exploitation often silence the most important voices, Nena stands apart. Every message, every voice note,
                every video call is protected by state-of-the-art end-to-end encryption, utilizing the X3DH and Double Ratchet protocols, with media streams secured by SFrame encryption.
               This ensures that your voice remains yours alone. When people feel safe, they speak truth, and truth is where transformation begins.
               Step into Nena, and you’ll discover more than tools, you’ll find spaces. Community Rooms where ideas flow and movements form. Conferencing Grids with floating reactions,
               breakout spaces, and spotlight controls. Study Modules with overlays that help learners reflect, collaborate, and grow. Creative Panels where podcasts and art come alive.
               Every pixel, every feature, every interaction is designed to celebrate identity, culture, and connection.
               At its heart, Nena is more than a platform, it is a movement for dialogue, inclusivity, and empowerment. It is where a mother in Kisumu can share her story, where a student in Nairobi can host a podcast, and where an activist in Mombasa can organize a campaign, all without fear, all with dignity. It is a place where dialogue sparks change, where empowerment narratives become tools for advocacy, and where communities rise together.

              </InfoText>
            </InfoCard>
            <InfoCard>
              <InfoTitle>Principles</InfoTitle>
              <InfoText>
                At Nena, our principles are the code we live by, the very foundation of the transformation we enable. We believe that every significant movement is born from conversation—dialogue is the engine of progress.
               We are committed to inclusivity by design, ensuring that every voice, from every corner of the community, can be part of this dialogue. 
               But for these voices to speak their truth, they must be safe. In an era of pervasive surveillance, we see security as a sacred trust.
                We provide a digital sanctuary where state-of-the-art encryption is not an option, but a guarantee. This is how we move communities from vulnerability to empowerment,
               creating a space where they can organize and advocate without fear. Ultimately, our purpose is empowerment. We engineer tools not just for discussion, but for tangible,
                data-driven outcomes. By capturing the fleeting moments of grassroots wisdom and transforming them into measurable victories, we shift the definition of success from superficial clicks to real-world change.
              </InfoText>
            </InfoCard>
            <InfoCard>
              <InfoTitle>Impact</InfoTitle>
              <InfoText>
                Nena provides a single, streamlined hub, transforming that digital chaos into a focused movement. 
                We capture those once-fleeting moments, creating a powerful, permanent repository of a community's collective intelligence, ready to be synthesized into data-driven proposals. 
                In our secure digital haven, the most vulnerable can organize and speak their truths without fear. Nena shifts the measure of success from empty clicks to the real-world victories of advocacy,
               providing the tools to draw a direct line from a single conversation to a successful campaign.
              </InfoText>
            </InfoCard>
          </Grid>
        </Section>

        <Footer>
          <span>© 2026 NENA. All rights reserved. Built by Jack Hamerton</span>
          <div>
            <FooterLink to="/login">Login</FooterLink> ·{' '}
            <FooterLink to="/signup">Sign Up</FooterLink>
          </div>
        </Footer>
      </Shell>
    </Page>
  );
};

export default LandingPage;
