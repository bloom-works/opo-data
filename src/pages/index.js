import React from "react"
import Image from "react-bootstrap/Image"
import Map from "../images/state_opo_performance.png"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import { Table } from "../components/table"

export default function Dashboard({ data }) {
  return (
    <Layout>
      <div>
        <Image id="tier-map" src={Map} style={{ marginBottom: "60px" }} />
        <Table data={data} />
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allExampledataCsv {
      edges {
        node {
          Donors_needed
          Notes
          OPO
          Organs_needed
          Patients_on_waitlist
          State_s_
          Tier
        }
      }
    }
  }
`
