import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Section,
  Html,
  Img,
  Link,
  Preview,
  Text,
  Button,
} from "@react-email/components";

interface ResetPasswordProps {
    token?: string; 
  }

const ResetPassword = ({
    token,
  }: ResetPasswordProps) => {
  const main = {
    backgroundColor: "#f6f9fc",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  };

  const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px 0 48px",
    marginTop:"20px",
    marginBottom: "64px",
  };

  const box = {
    padding: "20px 48px",
  };

  const hr = {
    borderColor: "#e6ebf1",
    margin: "20px 0",
  };

  const paragraph = {
    color: "#525f7f",
    fontSize: "16px",
    lineHeight: "24px",
    textAlign: "left" as const
  };

  const anchor = {
    color: "#556cd6",
  };

  const button = {
    backgroundColor: "#8b34ff",
    borderRadius: "5px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center",
    display: "block",
    width: "100%",
    padding: "10px",
  };

  const footer = {
    color: "#8898aa",
    fontSize: "12px",
    lineHeight: "16px",
  };

  const h1 = {
    color: "#333",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: "24px",
    fontWeight: "bold",
    padding: "0",
  };

  return (
    <Html>
      <Head />
      <Preview>Reset password with this link</Preview>
      <Body style={main}>
        <Container style={container}>
          <div style={box}>
            <Img
            src="/mwonya_logo.png"
              width="40"
              height="40"
              alt="Mwonya Logo"
            />
            <hr style={hr} />

            <Text style={h1}>
            Reset password with this link
            </Text>
            <Link
            href={`http://localhost:3000/auth/new-password?token=${token}`}
            target="_blank"
            style={{
              ...link,
              display: "block",
              marginBottom: "16px",
            }}
          >
            Click here to reset password </Link>
            <Text style={paragraph}>
            If you didn&apos;t try to reset your password, you can safely ignore this email
            </Text>
            
            <Text style={paragraph}>
              Best regards,<br />
              The MWonya Team
            </Text>
            <hr style={hr} />
            <Text style={footer}>
              © 2024 Mwonya. All rights reserved.
              <br />
              <Link href="http://localhost:3000/" style={anchor}>
                mwonya.com
              </Link>
              {" - "}
              Music, Podcast, DJ mixtapes, Events and Live Shows
            </Text>
          </div>
        </Container>
      </Body>
    </Html>
  );
};
const link = {
    color: "#2754C5",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: "14px",
    textDecoration: "underline",
  };

export default ResetPassword;