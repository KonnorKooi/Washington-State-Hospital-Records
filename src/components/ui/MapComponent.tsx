// src/components/MapComponent.js
import React, { useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import "./MapComponent.css"; // Import the CSS file for styling

const MapComponent = ({
  apiKey,
  mapId,
  hospitals,
  onMarkerClick,
}: {
  apiKey: string;
  mapId: string;
  hospitals: any[];
  onMarkerClick: (hospital: any) => void;
}) => {
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [marker] = useAdvancedMarkerRef();
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
    // console.log("Hospital Object:", hospital);
    const lat = parseFloat(hospital.Lat);
    const long = parseFloat(hospital.Long);
    // console.log("Parsed lat:", lat);
    // console.log("Parsed long:", long);
    return !isNaN(lat) && !isNaN(long);
  });

  // console.log("Filtered Hospitals:", filteredHospitals);
  // console.log("Map Center:", mapCenter);
  // console.log("Map Zoom:", mapZoom);

  return (
    <APIProvider
      apiKey={apiKey}
      onLoad={() => console.log("Maps API has loaded.")}>
      <div className="map-container">
        <Map
          zoom={mapZoom}
          center={mapCenter}
          mapId={mapId}
          onCameraChanged={handleCameraChange}>
          {filteredHospitals.map((hospital, index) => {
            const { lat, long } = hospital;
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
            <InfoWindow
              maxWidth={200}
              onCloseClick={() => setInfowindowOpen(false)}>
              This is an example for the{" "}
              <code style={{ whiteSpace: "nowrap" }}>
                &lt;AdvancedMarker /&gt;
              </code>{" "}
              combined with an Infowindow.
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
};

export default MapComponent;
