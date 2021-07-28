import React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { Container, Row } from "react-bootstrap";

import * as styles from "./layout.module.css";

export default function Layout({ children }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  );

  return (
    <Container fluid>
      <Row className={styles.header}>
        <Link to="/" className={styles.logoWithText}>
          <StaticImage
            src="../../images/logo.png"
            alt="logo"
            placeholder="none"
          />
          <div className={styles.logoText}>
            <h1>{site.siteMetadata.title}</h1>
            <h2>Performance Comparison</h2>
          </div>
        </Link>
        <Link to="/faqs" className={styles.faqLink}>
          <p>About Our Organ Donation System</p>
        </Link>
      </Row>
      {children}
      <Row className={styles.footer}>
        <p>
          Research supported by Arnold Ventures and Schmidt Futures in
          partnership with Organize and the Federation of American Scientists.
        </p>
        <StaticImage
          src="../../images/logos/Arnold Ventures.png"
          alt="Arnold Ventures"
          height={35}
        />
        <StaticImage
          src="../../images/logos/Schmidt Futures.png"
          alt="Schmidt Futures"
          height={35}
        />
        <StaticImage
          src="../../images/logos/Bloomworks.png"
          alt="Bloomworks"
          height={35}
        />
        <StaticImage
          src="../../images/logos/Organize.png"
          alt="Organize"
          height={35}
        />
        <StaticImage src="../../images/logos/FAS.png" alt="FAS" height={35} />
      </Row>
    </Container>
  );
}
