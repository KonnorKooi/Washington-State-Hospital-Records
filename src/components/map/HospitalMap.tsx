"use client";

import type { GeoJSONSource } from "maplibre-gl";
import type { MapLayerMouseEvent, MapRef } from "react-map-gl/maplibre";
import Map, {
  Layer,
  NavigationControl,
  Source,
  type LayerProps,
} from "react-map-gl/maplibre";
import { useCallback, useMemo, useRef } from "react";

import type { Hospital } from "@/data/schema";

import "maplibre-gl/dist/maplibre-gl.css";

/**
 * NOTE ON VERSIONS: maplibre-gl is pinned to 5.x on purpose.
 *
 * react-map-gl 8.1.2 declares a peer range of maplibre-gl >=4, but it does not
 * actually work with maplibre-gl 6. v6 is ESM-only and ships its web worker as
 * a separate module rather than an inlined blob; under react-map-gl the worker
 * starts but never processes anything, so vector tiles, glyphs and GeoJSON
 * sources are silently never parsed. The map renders the raster basemap and
 * looks *almost* right, but `load` never fires and no markers ever appear —
 * with no console error anywhere. Bare maplibre-gl 6 works fine; it is the
 * combination that breaks.
 *
 * Before bumping to maplibre-gl 6, confirm react-map-gl has released support
 * for it, and verify markers actually render — a passing build proves nothing
 * here.
 */

/**
 * Free, key-less vector tiles. Overridable so the tile host can be swapped
 * (or self-hosted) without touching code — note that the CSP in
 * deploy/security-headers.conf must allow whichever host is used.
 */
const MAP_STYLE =
  process.env.NEXT_PUBLIC_MAP_STYLE_URL ??
  "https://tiles.openfreemap.org/styles/liberty";

const WASHINGTON_BOUNDS: [number, number, number, number] = [
  -124.9, 45.4, -116.8, 49.1,
];

const CLUSTER_LAYER: LayerProps = {
  id: "clusters",
  type: "circle",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": "#31708E",
    "circle-opacity": 0.9,
    "circle-radius": ["step", ["get", "point_count"], 16, 5, 22, 15, 28],
    "circle-stroke-width": 2,
    "circle-stroke-color": "#ffffff",
  },
};

const CLUSTER_COUNT_LAYER: LayerProps = {
  id: "cluster-count",
  type: "symbol",
  filter: ["has", "point_count"],
  layout: {
    "text-field": ["get", "point_count_abbreviated"],
    "text-size": 13,
    "text-font": ["Noto Sans Bold"],
  },
  paint: { "text-color": "#ffffff" },
};

const POINT_LAYER: LayerProps = {
  id: "hospital-points",
  type: "circle",
  filter: ["!", ["has", "point_count"]],
  paint: {
    // Reads the `selected` property baked into the GeoJSON, which is rebuilt
    // whenever selectedId changes.
    "circle-color": [
      "case",
      ["boolean", ["get", "selected"], false],
      "#B91C1C",
      "#5085A5",
    ],
    "circle-radius": ["case", ["boolean", ["get", "selected"], false], 11, 8],
    "circle-stroke-width": 2,
    "circle-stroke-color": "#ffffff",
  },
};

/**
 * Replaces the Google Maps implementation. Beyond removing the API key and
 * billing requirement, this drops the old onCameraChanged -> setState loop,
 * which re-rendered every marker on every frame of a pan, and adds clustering
 * so the map stays legible as the dataset grows.
 *
 * The map is a supplementary view: the hospital list beside it carries the
 * same information and is fully keyboard operable.
 */
export function HospitalMap({
  hospitals,
  selectedId,
  onSelect,
}: {
  hospitals: readonly Hospital[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const mapRef = useRef<MapRef>(null);

  const geojson = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: hospitals
        .filter((hospital) => hospital.coordinates !== null)
        .map((hospital) => ({
          type: "Feature" as const,
          id: hospital.id,
          geometry: {
            type: "Point" as const,
            coordinates: [hospital.coordinates!.lng, hospital.coordinates!.lat],
          },
          properties: {
            id: hospital.id,
            name: hospital.name,
            selected: hospital.id === selectedId,
          },
        })),
    }),
    [hospitals, selectedId],
  );

  const handleClick = useCallback(
    (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0];
      if (!feature) return;

      // Clicking a cluster zooms into it rather than selecting anything.
      if (feature.properties?.["cluster_id"] !== undefined) {
        const map = mapRef.current?.getMap();
        const source = map?.getSource("hospitals");
        if (source && "getClusterExpansionZoom" in source) {
          void (source as GeoJSONSource)
            .getClusterExpansionZoom(Number(feature.properties["cluster_id"]))
            .then((zoom) => {
              const geometry = feature.geometry;
              if (geometry.type !== "Point") return;
              map?.easeTo({
                center: geometry.coordinates as [number, number],
                zoom,
                duration: 400,
              });
            });
        }
        return;
      }

      const id = feature.properties?.["id"];
      if (typeof id === "string") onSelect(id);
    },
    [onSelect],
  );

  return (
    <Map
      ref={mapRef}
      mapStyle={MAP_STYLE}
      initialViewState={{
        bounds: WASHINGTON_BOUNDS,
        fitBoundsOptions: { padding: 24 },
      }}
      style={{ width: "100%", height: "100%" }}
      interactiveLayerIds={["clusters", "hospital-points"]}
      onClick={handleClick}
      onMouseEnter={() => {
        const canvas = mapRef.current?.getCanvas();
        if (canvas) canvas.style.cursor = "pointer";
      }}
      onMouseLeave={() => {
        const canvas = mapRef.current?.getCanvas();
        if (canvas) canvas.style.cursor = "";
      }}
      attributionControl={{ compact: true }}
    >
      <NavigationControl position="top-right" showCompass={false} />
      <Source
        id="hospitals"
        type="geojson"
        data={geojson}
        cluster
        clusterRadius={45}
        clusterMaxZoom={11}
      >
        <Layer {...CLUSTER_LAYER} />
        <Layer {...CLUSTER_COUNT_LAYER} />
        <Layer {...POINT_LAYER} />
      </Source>
    </Map>
  );
}
