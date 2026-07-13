import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const mapPosition = [-1.4757932213119416, 101.04292494620746];

export default function MapPreview() {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-900 p-2">
      <MapContainer
        center={mapPosition}
        className="z-0 h-[420px] w-full overflow-hidden rounded-md"
        scrollWheelZoom
        zoom={19}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={mapPosition}>
          <Popup>
            Lokasi marker
            <br />
            Koordinat berhasil muncul
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
