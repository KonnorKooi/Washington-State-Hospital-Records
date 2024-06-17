import React, { useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import styles from "./MapComponent.module.css";

interface MapComponentProps {
  apiKey: string;
  mapId: string;
  hospitals: any[];
  onMarkerClick: (hospital: any) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  apiKey,
  mapId,
  hospitals,
  onMarkerClick,
}) => {
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState({
    lat: 47.2,
    lng: -121,
  });
  const [mapZoom, setMapZoom] = useState(7);

  const handleCameraChange = (ev: { detail: { center: any; zoom: any } }) => {
    const { center, zoom } = ev.detail;
    setMapCenter(center);
    setMapZoom(zoom);
  };

  const filteredHospitals = hospitals.filter((hospital) => {
    const lat = parseFloat(hospital.Lat);
    const long = parseFloat(hospital.Long);
    return !isNaN(lat) && !isNaN(long);
  });

  return (
    <APIProvider apiKey={apiKey} onLoad={() => console.log("Maps API has loaded.")}>
      <div className={styles.mapContainer}>
        <Map
          zoom={mapZoom}
          center={mapCenter}
          mapId={mapId}
          streetViewControl={false}
          fullscreenControl={false}
          onCameraChanged={handleCameraChange}
        >
          {filteredHospitals.map((hospital, index) => {
            const lat = parseFloat(hospital.Lat);
            const long = parseFloat(hospital.Long);

            return (
              <AdvancedMarker
                key={index}
                onClick={() => {
                  onMarkerClick(hospital);
                  setInfowindowOpen(true);
                }}
                position={{ lat: lat, lng: long }}
                title={hospital.Hospital}
              />
            );
          })}
          {infowindowOpen && (
            <InfoWindow maxWidth={200} onCloseClick={() => setInfowindowOpen(false)}>
              This is an example for the{" "}
              <code style={{ whiteSpace: "nowrap" }}>
                &lt;AdvancedMarker /&gt;
              </code>{" "}
              combined with an InfoWindow.
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
};

export default MapComponent;
