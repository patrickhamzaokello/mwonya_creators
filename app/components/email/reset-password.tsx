import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components"

interface ResetPasswordProps {
  token?: string
  username?: string
}

const ResetPassword = ({ token, username = "Mwonya User" }: ResetPasswordProps) => {
  const main = {
    backgroundColor: "#f9f9f9",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  }

  const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "24px",
    marginBottom: "64px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  }

  const header = {
    backgroundColor: "#8b34ff",
    borderRadius: "8px 8px 0 0",
    padding: "24px",
    textAlign: "center" as const,
  }

  const logo = {
    margin: "0 auto",
    width: "80px",
    height: "auto",
  }

  const h1 = {
    color: "#333333",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "32px 0 16px",
    padding: "0",
    textAlign: "center" as const,
  }

  const paragraph = {
    color: "#555555",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "16px 0",
    textAlign: "left" as const,
  }

  const button = {
    backgroundColor: "#8b34ff",
    borderRadius: "4px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    width: "100%",
    padding: "12px",
    marginTop: "32px",
    marginBottom: "32px",
  }

  const footer = {
    color: "#8898aa",
    fontSize: "12px",
    lineHeight: "16px",
    textAlign: "center" as const,
    marginTop: "32px",
  }

  const link = {
    color: "#8b34ff",
    textDecoration: "underline",
  }

  const resetUrl = `https://creator.mwonya.com/auth/new-password?token=${token}`

  return (
    <Html>
      <Head />
      <Preview>Reset Your Mwonya Password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src="https://creator.mwonya.com/mwonya_logo.png"
              width="80"
              height="80"
              alt="Mwonya Logo"
              style={logo}
            />
          </Section>
          <Heading style={h1}>Password Reset Request</Heading>
          <Text style={paragraph}>Hello {username},</Text>
          <Text style={paragraph}>
            We received a request to reset your password for your Mwonya account. If you didn't make this request, you
            can safely ignore this email.
          </Text>
          <Text style={paragraph}>To reset your password, click the button below:</Text>
          <Button pX={20} pY={12} style={button} href={resetUrl}>
            Reset Your Password
          </Button>
          <Text style={paragraph}>
            This link will expire in 1 hour for security reasons. If you need to reset your password after that, please
            request a new reset link.
          </Text>
          <Text style={paragraph}>
            If the button above doesn't work, you can also copy and paste the following link into your browser:
          </Text>
          <Text style={{ ...paragraph, wordBreak: "break-all" }}>
            <Link href={resetUrl} style={link}>
              {resetUrl}
            </Link>
          </Text>
          <Text style={paragraph}>
            If you have any questions or need assistance, please don't hesitate to contact our support team.
          </Text>
          <Text style={paragraph}>
            Best regards,
            <br />
            The Mwonya Team
          </Text>
          <Text style={footer}>
            © 2024 Mwonya. All rights reserved.
            <br />
            <Link href="https://creator.mwonya.com/" style={link}>
              mwonya.com
            </Link>
            {" - "}
            Music, Podcast, DJ mixtapes, Events and Live Shows
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default ResetPassword