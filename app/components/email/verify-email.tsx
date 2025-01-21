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

const VerificationEmail = ({ token }: any) => {
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
    textAlign: "left" as const,
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
    textAlign: "center" as const,
    display: "block",
    width: "100%",
    padding: "10px",
  };

  const footer = {
    color: "#8898aa",
    fontSize: "12px",
    lineHeight: "16px",
  };

  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>
      <Body style={main}>
        <Container style={container}>
          <div style={box}>
            <Img
            src="/mwonya_logo.png"
              width="100"
              height="40"
              alt="Mwonya Logo"
            />
            <hr style={hr} />
            <Text style={paragraph}>Hello,</Text>
            <Text style={paragraph}>
              Thank you for signing up for Mwonya. To complete your
              registration, please verify your email address by clicking the
              button below:
            </Text>
            <Button
              style={button}
              href={`https://creator.mwonya.com/auth/new-verification?token=${token}`}
            >
              Verify Email Address
            </Button>
            <Text style={paragraph}>
              If you didn't create an account on Mwonya, you can safely ignore
              this email.
            </Text>
            <Text style={paragraph}>
              Best regards,<br />
              The MWonya Team
            </Text>
            <hr style={hr} />
            <Text style={footer}>
              © 2024 Mwonya. All rights reserved.
              <br />
              <Link href="https://creator.mwonya.com/" style={anchor}>
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

export default VerificationEmail;