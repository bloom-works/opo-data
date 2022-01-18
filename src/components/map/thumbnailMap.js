import React from "react";
import { Row } from "react-bootstrap";
import { GeoJSON, MapContainer } from "react-leaflet";
import bbox from "@turf/bbox";

import useDataMaps from "../../hooks/useDataMaps";
import {
  tierColors,
} from "../../utils/utils";

import * as styles from "./map.module.css";
import useGeoJson from "../../hooks/useGeoJson";

export default function ThumnailMap({
  dimensions,
  dataId, // state or OPO abbr (e.g. AZ or ALOB)
  view, // "state" or "opo"
}) {
  const [{ opoDataMap, stateDataMap }] = useDataMaps();
  const { dsaGeoData, statesGeoData } = useGeoJson();

  // compose fill OPO geoJson with appropriately filtered
  // OPO features based on view ("opo" or "state")
  const fillGeoJson =
  {
    ...dsaGeoData?.childGeoJson,
    features: getOpoFeatures(view, dsaGeoData.childGeoJson.features, opoDataMap, dataId)
      .map(f => ({
        ...f,
        properties: {
          ...f.properties,
          tier: opoDataMap[f.properties.abbreviation].tier,
        }
      }))
  };

  // Compose boundary state geoJson with appropriately filtered
  // state features based on view ("opo" or "state")
  const boundaryGeoJson = {
    ...statesGeoData.childGeoJson,
    features: getStateFeatures(view, statesGeoData.childGeoJson.features, dataId)
      .map(f => ({
        ...f,
        properties: {
          ...f.properties,
          name: stateDataMap[f.properties.abbreviation].name,
        },
      })),
  };

  // Generate bounding box
  // - For state view, use boundary geoms
  //  (which will only include single state given by dataId)
  // - For OPO view, use fill geoms
  //  (which will only include single OPO given by dataId)
  const [minX, minY, maxX, maxY] = bbox(
    view === "state"
      ? boundaryGeoJson
      : fillGeoJson
  );

  return (
    <Row className={styles.map}>
      <div style={dimensions}>
        {
          // Hack: [`window` dependency for Leaflet](https://www.gatsbyjs.com/docs/debugging-html-builds/#fixing-third-party-modules)
          typeof window !== "undefined" && (
            <MapContainer
              key={dataId.name + " container"}
              bounds={[
                [minY, minX],
                [maxY, maxX],
              ]}
              scrollWheelZoom={false}
              style={{...dimensions,  backgroundColor: "#fff" }}
              zoomControl={false}
              touchZoom={false}
              dragging={false}
              className={styles.mapContainer + " thumbnail"}
            >               
              {/* Create layer for all state polygons with fill (to contextualize other geoms!) */}
              <GeoJSON
                key={dataId + "state-fill"}
                data={{...statesGeoData.childGeoJson}}
                interactive={false}
                style={{
                  fillColor: "blue",
                  fillOpacity: 0.85,
                  opacity: 0.75,
                  weight: 0.75,
                }}
              />
              {/* Create layer for OPO polygons with fill based on performance tier */}
              <GeoJSON
                key={dataId + "opo-fill"}
                data={fillGeoJson}
                interactive={false}
                style={feature => ({
                  color: "white",
                  fillColor: tierColors[feature.properties.tier.split(" ")[1]],
                  fillOpacity: 0.85,
                  opacity: 0.75,
                  weight: 0.75,
                })}
                // Add permanent tool tip to act as OPO label
                // TODO: These currently appear centered in the OPO polygon, 
                // which does not always align with the state-derived bounding box
                // and may appear very near the edge or not at all
                onEachFeature={(_, layer) =>
                  view === "state"
                    ? layer.bindTooltip(layer => layer.feature.properties.abbreviation, {
                        permanent: true,
                        direction: "center",
                        className: styles.opoLabel,
                      })
                    : layer
                }
              />
              {/* Create layer for state polygons with boundaries */}
              <GeoJSON
                key={dataId + "boundaries"}
                data={boundaryGeoJson}
                interactive={false}
                style={{
                  color: "white",
                  fillOpacity: 0,
                  weight: 2,
                }}
              />
            </MapContainer>
          )
        }
      </div>
    </Row>
  );
}

/**
 * Get appropriately filtered OPO features based on view
 * For state view, all OPOs that service the given state
 * For OPO view, the given OPO
 */
const getOpoFeatures = (view, allFeatures, opoDataMap, dataId) => {
  if (view === "state") {
    return allFeatures.filter(
      f =>
        opoDataMap[f.properties.abbreviation].statesWithRegions[
          dataId
        ] !== undefined
    )
  }

  return [allFeatures.find(({ properties: { abbreviation } }) => abbreviation === dataId)]; 
}

/**
 * Get appropriately filtered state features based on view
 * For state view, the given state
 * For OPO view, all states (bounding box will restrict displayed geoms)
 */
const getStateFeatures = (view, allFeatures, dataId) => {
  if (view === "state") {
    return [allFeatures.find(
        ({ properties: { abbreviation } }) => abbreviation === dataId
      )]
    }

    return allFeatures;
}