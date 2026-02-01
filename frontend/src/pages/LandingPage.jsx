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
            <Eyebrow>About Us</Eyebrow>
            <Title>Human-first collaboration for teams that move fast.</Title>
            <Subtitle>
              NENA brings secure communication, study spaces, and community tools into one calm,
              focused experience. We design for clarity, trust, and momentum.
            </Subtitle>
            <CTA>
              <SolidLink to="/login">Log In</SolidLink>
              <GhostLink to="/signup">Create Account</GhostLink>
            </CTA>
          </HeroContent>
          <HeroCard>
            <CardTitle>What we deliver</CardTitle>
            <List>
              <li>Purpose-built rooms, messaging, and study spaces.</li>
              <li>Privacy-forward collaboration with configurable roles.</li>
              <li>Analytics that spotlight engagement without noise.</li>
              <li>Thoughtful UI that keeps your team aligned.</li>
            </List>
          </HeroCard>
        </Hero>

        <Section>
          <SectionHeader>
            <SectionTitle>Our story</SectionTitle>
            <SectionSubtitle>
              We started NENA to help mission-driven teams build trust and pace in the same place.
            </SectionSubtitle>
          </SectionHeader>
          <Grid>
            <InfoCard>
              <InfoTitle>Mission</InfoTitle>
              <InfoText>
                Make collaboration feel human, secure, and resilient for distributed teams.
              </InfoText>
            </InfoCard>
            <InfoCard>
              <InfoTitle>Principles</InfoTitle>
              <InfoText>
                Privacy by default, clarity over clutter, and tools that respect your time.
              </InfoText>
            </InfoCard>
            <InfoCard>
              <InfoTitle>Impact</InfoTitle>
              <InfoText>
                Teams use NENA to host events, share insights, and keep communities thriving.
              </InfoText>
            </InfoCard>
          </Grid>
        </Section>

        <Footer>
          <span>© 2026 NENA. All rights reserved.</span>
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
