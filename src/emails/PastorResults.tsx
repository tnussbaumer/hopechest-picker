import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface PastorResultsProps {
  contactName: string;
  topMatches: Array<{
    country: string;
    score: number;
    reasons: string[];
  }>;
  scheduleUrl?: string;
}

export const PastorResults = ({
  contactName,
  topMatches,
  scheduleUrl = 'https://www.hopechest.org/vision-trips/',
}: PastorResultsProps) => {
  const firstName = contactName.split(' ')[0];
  
  return (
    <Html>
      <Head />
      <Preview>Your HopeChest Partnership Guide - Top Country Matches</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your HopeChest Partnership Guide</Heading>
          
          <Section style={section}>
            <Text style={greeting}>Hi {firstName},</Text>
            <Text style={text}>
              Thank you for using the HopeChest Partnership Fit Guide! We're excited to help 
              you find the perfect match for your church's vision trip.
            </Text>
            <Text style={text}>
              Based on your church's priorities and preferences, here are your top 3 
              recommended countries for 2026:
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            {topMatches.map((match, index) => (
              <div key={index} style={matchContainer}>
                <Heading as="h2" style={countryHeading}>
                  {index + 1}. {match.country}
                </Heading>
                <Text style={matchScore}>
                  {Math.round(match.score)}% Match
                </Text>
                <Text style={whyFitHeading}>Why it's a fit:</Text>
                <ul style={reasonsList}>
                  {match.reasons.map((reason, reasonIndex) => (
                    <li key={reasonIndex} style={reasonItem}>{reason}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>

          <Hr style={hr} />

          <Section style={ctaSection}>
            <Text style={text}>
              Ready to take the next step? View the complete 2026 schedule and available 
              trip dates for your top matches.
            </Text>
            <Button style={button} href={scheduleUrl}>
              View Full 2026 Schedule
            </Button>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Text style={closingText}>
              Our team will be in touch soon to discuss next steps and answer any questions 
              you may have. We're here to support you every step of the way as you explore 
              partnership opportunities with HopeChest.
            </Text>
            <Text style={signatureText}>
              Blessings,<br />
              <strong>The HopeChest Team</strong>
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            HopeChest | Empowering vulnerable children through relational care<br />
            Questions? Reply to this email or contact us at partnerships@hopechest.org
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default PastorResults;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#333',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0 30px',
  padding: '0 40px',
  textAlign: 'center' as const,
};

const section = {
  padding: '0 40px',
};

const greeting = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '20px 0 10px',
  fontWeight: '500',
};

const text = {
  color: '#333',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '16px 0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '30px 40px',
};

const matchContainer = {
  marginBottom: '30px',
  padding: '20px',
  backgroundColor: '#f8fafc',
  borderLeft: '4px solid #2563eb',
  borderRadius: '6px',
};

const countryHeading = {
  color: '#2563eb',
  fontSize: '22px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const matchScore = {
  color: '#10b981',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px 0',
};

const whyFitHeading = {
  color: '#555',
  fontSize: '15px',
  fontWeight: '600',
  margin: '12px 0 8px 0',
};

const reasonsList = {
  margin: '0',
  paddingLeft: '20px',
};

const reasonItem = {
  fontSize: '14px',
  color: '#555',
  lineHeight: '22px',
  marginBottom: '8px',
};

const ctaSection = {
  padding: '0 40px',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  margin: '20px 0',
};

const closingText = {
  color: '#333',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '16px 0',
};

const signatureText = {
  color: '#333',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '24px 0 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '20px',
  textAlign: 'center' as const,
  marginTop: '20px',
  padding: '0 40px',
};
