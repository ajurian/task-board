import {
    Body,
    Column,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Row,
    Section,
    Text,
} from "@react-email/components";

const main = {
    backgroundColor: "#f5f5f5",
    fontFamily: '"Roboto", "Helevetica", "Arial", sans-serif',
};

const container = {
    backgroundColor: "#fff",
    margin: "auto",
};

const headerTitle = {
    color: "rgba(0, 0, 0, 0.6)",
    letterSpacing: "0em",
    fontSize: "1.5rem",
    fontWeight: 500,
    lineHeight: 1.334,
    margin: 0,
};

const mainTitle = {
    color: "rgba(0, 0, 0, 0.87)",
    letterSpacing: "0.00938em",
    fontSize: "1.125rem",
    fontWeight: 400,
    lineHeight: 1.75,
    margin: 0,
};

const hr = {
    borderColor: "rgba(0, 0, 0, 0.12)",
};

export default function EmailTemplate() {
    return (
        <Html lang="en">
            <Head />
            <Body style={main}>
                <Container style={container}>
                    <Section>
                        <Row>
                            <Column>
                                <Heading as="h1" style={headerTitle}>
                                    TaskBoard
                                </Heading>
                            </Column>
                        </Row>
                    </Section>

                    <Section>
                        <Hr style={hr} />
                        <Heading as="h2" style={mainTitle}>
                            Adolf James Urian wants to have access
                        </Heading>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}
