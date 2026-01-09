import {
  Body,
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

interface InternalAlertProps {
  churchName: string;
  contactName: string;
  contactEmail: string;
  contactRole?: string;
  topMatches: Array<{
    country: string;
    score: number;
    reasons: string[];
  }>;
}

export const InternalAlert = ({
  churchName,
  contactName,
  contactEmail,
  contactRole,
  topMatches,
}: InternalAlertProps) => {
  return (
    <Html>
      <Head />
      <Preview>New Vision Trip Lead: {churchName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🎯 New Vision Trip Lead</Heading>
          
          <Section style={section}>
            <Heading as="h2" style={h2}>Church Information</Heading>
            <Text style={text}>
              <strong>Church Name:</strong> {churchName}
            </Text>
            <Text style={text}>
              <strong>Contact Name:</strong> {contactName}
            </Text>
            <Text style={text}>
              <strong>Contact Role:</strong> {contactRole || 'Not specified'}
            </Text>
            <Text style={text}>
              <strong>Email:</strong> {contactEmail}
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Heading as="h2" style={h2}>Top 3 Country Matches</Heading>
            
            {topMatches.map((match, index) => (
              <div key={index} style={matchContainer}>
                <Text style={matchHeader}>
                  #{index + 1} - {match.country} ({Math.round(match.score)}% match)
                </Text>
                <ul style={reasonsList}>
                  {match.reasons.map((reason, reasonIndex) => (
                    <li key={reasonIndex} style={reasonItem}>{reason}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            This lead was generated from the HopeChest Partnership Fit Guide
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default InternalAlert;

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
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
  padding: '0 40px',
};

const h2 = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '20px 0 10px',
};

const section = {
  padding: '0 40px',
};

const text = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '4px 0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 40px',
};

const matchContainer = {
  marginBottom: '20px',
  padding: '15px',
  backgroundColor: '#f8f9fa',
  borderRadius: '6px',
};

const matchHeader = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#2563eb',
  margin: '0 0 10px 0',
};

const reasonsList = {
  margin: '0',
  paddingLeft: '20px',
};

const reasonItem = {
  fontSize: '14px',
  color: '#555',
  lineHeight: '22px',
  marginBottom: '6px',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  marginTop: '20px',
};
