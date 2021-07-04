import React from "react";
import { graphql, Link } from "gatsby";
import { getImage, StaticImage } from "gatsby-plugin-image";
import { BgImage } from "gbimage-bridge";
import { Row, Col } from "react-bootstrap";
import { ArrowRight } from "react-bootstrap-icons";
import ReactMarkdown from "react-markdown";
import ReactPlayer from "react-player";

import Layout from "../components/layout";
import Map from "../components/map";

import * as styles from "./index.module.css";
import content from "./index.content.yml";

export default function Dashboard({
  data: { dsaGeoData, statesGeoData, opoData, statesData, quoteImage },
}) {
  const { stats, quote, video } = content;
  const tierData = opoData?.nodes?.reduce(
    (opoDataMap, { opo, tier }) => ({
      ...opoDataMap,
      [opo]: tier,
    }),
    {}
  );
  const stateNameData = statesData?.nodes?.reduce(
    (stateNameMap, { abbreviation, name }) => ({
      ...stateNameMap,
      [abbreviation]: name,
    }),
    {}
  );

  return (
    <Layout>
      <Map
        dsaGeoJSON={{
          ...dsaGeoData?.childGeoJson,
          features: dsaGeoData?.childGeoJson?.features?.map(feature => ({
            ...feature,
            properties: {
              ...feature.properties,
              tier: tierData[feature.properties.opo],
            },
          })),
        }}
        interactive={true}
        statesGeoJSON={{
          ...statesGeoData?.childGeoJson,
          features: statesGeoData?.childGeoJson?.features?.map(feature => ({
            ...feature,
            properties: {
              ...feature.properties,
              name: stateNameData[feature.properties.abbreviation],
            },
          })),
        }}
      />
      <Row className={styles.statsSection}>
        {Object.values(stats).map(({ title, value }) => (
          <Col className="mx-5" key={title}>
            <Row className="h-50">
              <h3>{title}</h3>
            </Row>
            <Row className="justify-content-center">
              <p>{value}</p>
            </Row>
          </Col>
        ))}
      </Row>
      <Row>
        <BgImage
          className={styles.quoteImgBackground}
          image={getImage(quoteImage)}
        >
          <Col className={styles.quoteSection} md={{ span: 5, offset: 6 }}>
            <figure>
              <blockquote>{quote.quote}</blockquote>
            </figure>
            <figcaption>
              &mdash; <cite>{quote.attribution}</cite>
            </figcaption>
          </Col>
        </BgImage>
      </Row>
      <Row className={`mx-5 ${styles.videoSection}`}>
        <Col className="mx-5">
          <Row>
            <h3>{video.title}</h3>
          </Row>
          <Row>
            <ReactMarkdown>{video.description}</ReactMarkdown>
          </Row>
          <Row>
            <Link to={video.link}>
              <h4>
                See the full video
                <ArrowRight className={styles.rightArrow} />
              </h4>
            </Link>
          </Row>
        </Col>
        <Col className="align-items-center">
          <ReactPlayer url={video.link} />
        </Col>
      </Row>
      <Row className={`mx-4 ${styles.articlesSection}`}>
        <Col className="mx-4">
          <Row>
            <StaticImage src="../images/editorial1.png" alt="news-article" />
          </Row>
          <Row className="h-25">
            <h3>They Survived Covid. Now They Need New Lungs.</h3>
          </Row>
          <Row className="h-25">
            <p>
              He survived Covid-19, but his lungs were ravaged. After months of
              deep sedation, he is delirious, his muscles atrophied. And this
              61-year-old still cannot breathe on his own.
            </p>
          </Row>
          <Row>
            <Link to="https://www.nytimes.com/2021/04/29/opinion/covid-19-lung-transplants.html">
              <h4>
                Read more
                <ArrowRight className={styles.rightArrow} />
              </h4>
            </Link>
          </Row>
        </Col>
        <Col className="mx-4">
          <Row>
            <StaticImage src="../images/editorial2.png" alt="news-article" />
          </Row>
          <Row className="h-25">
            <h3>
              New Organ Donation Rule Is A Win For Black Patients And Health
              Equity
            </h3>
          </Row>
          <Row className="h-25">
            <p>
              The Department of Health and Human Services (HHS) recently
              finalized reforms targeted at the government contractors that run
              the organ donation system.
            </p>
          </Row>
          <Row>
            <Link to="https://www.healthaffairs.org/do/10.1377/hblog20201211.229975/full/">
              <h4>
                Read more
                <ArrowRight className={styles.rightArrow} />
              </h4>
            </Link>
          </Row>
        </Col>
        <Col className="mx-4">
          <Row>
            <StaticImage src="../images/editorial3.png" alt="news-article" />
          </Row>
          <Row className="h-25">
            <h3>
              Organ collection agencies told to improve performance or face
              tighter rules
            </h3>
          </Row>
          <Row className="h-25">
            <p>
              With 107,000 people waiting for kidneys, hearts, livers and other
              organs, a congressional subcommittee renewed efforts to force
              organ procurement organizations to improve.
            </p>
          </Row>
          <Row>
            <Link to="https://www.washingtonpost.com/health/organ-collection-agencies-told-to-improve-performance-or-face-tighter-rules/2021/05/04/68847bce-ad06-11eb-acd3-24b44a57093a_story.html">
              <h4>
                Read more
                <ArrowRight className={styles.rightArrow} />
              </h4>
            </Link>
          </Row>
        </Col>
      </Row>
    </Layout>
  );
}

export const query = graphql`
  query {
    quoteImage: file(relativePath: { eq: "images/quoteImage.png" }) {
      childImageSharp {
        gatsbyImageData(placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
      }
    }
    dsaGeoData: file(relativePath: { eq: "data/dsas.geojson" }) {
      childGeoJson {
        features {
          geometry {
            type
            coordinates
          }
          properties {
            opo
          }
          type
        }
      }
    }
    statesGeoData: file(relativePath: { eq: "data/states.geojson" }) {
      childGeoJson {
        features {
          geometry {
            type
            coordinates
          }
          properties {
            abbreviation
          }
          type
        }
      }
    }
    opoData: allOposCsv {
      nodes {
        opo
        tier
      }
    }
    statesData: allStatesCsv {
      nodes {
        abbreviation
        name
      }
    }
  }
`;
