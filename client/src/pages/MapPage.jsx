import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import Navbar from '../components/Navbar'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const hospitalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

const OVERPASS_URLS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
]

const QUERY = `
  [out:json][timeout:30];
  area["ISO3166-1"="BD"]["admin_level"="2"]->.searchArea;
  (
    node["amenity"="hospital"](area.searchArea);
    way["amenity"="hospital"](area.searchArea);
  );
  out center 200;
`

function FitBounds({ places }) {
  const map = useMap()
  useEffect(() => {
    if (places.length > 0) {
      const bounds = places.map(p => [p.lat, p.lon])
      map.fitBounds(bounds, { padding: [40, 40] })
    }
  }, [places, map])
  return null
}

function LocationMarker() {
  const [position, setPosition] = useState(null)
  const map = useMap()

  useEffect(() => {
    map.locate({ setView: false, watch: false })

    map.on('locationfound', (e) => {
      setPosition(e.latlng)
    })

    map.on('locationerror', () => {
      // silently fail if user denies location
    })
  }, [map])

  if (!position) return null

  const blueDot = L.divIcon({
    className: '',
    html: `<div class="blue-dot"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })

  return (
    <Marker position={position} icon={blueDot}>
      <Popup>
        <div className="map-popup">
          <span className="map-popup-tag donation">Your Location</span>
          <h3>You are here</h3>
        </div>
      </Popup>
    </Marker>
  )
}

function MapPage() {
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchPlaces() {
      sessionStorage.removeItem('bd_hospitals')

      const cached = sessionStorage.getItem('bd_hospitals_v2')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (parsed.length > 0) {
          setHospitals(parsed)
          setLoading(false)
          return
        }
      }

      for (const url of OVERPASS_URLS) {
        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `data=${encodeURIComponent(QUERY)}`,
          })

          if (res.status === 429) continue

          const data = await res.json()

          const parsed = (data.elements || [])
            .map(el => ({
              id: el.id,
              lat: el.lat ?? el.center?.lat,
              lon: el.lon ?? el.center?.lon,
              name: el.tags?.name || el.tags?.['name:en'] || 'Unnamed Hospital',
              address: [
                el.tags?.['addr:street'],
                el.tags?.['addr:city'],
                el.tags?.['addr:district'],
              ].filter(Boolean).join(', ') || 'Address not available',
              phone: el.tags?.phone || el.tags?.['contact:phone'] || 'Not available',
            }))
            .filter(el => el.lat && el.lon)

          if (parsed.length > 0) {
            sessionStorage.setItem('bd_hospitals_v2', JSON.stringify(parsed))
            setHospitals(parsed)
            setLoading(false)
            return
          }
        } catch (err) {
          continue
        }
      }

      setError('Failed to load hospitals. Please refresh the page and try again.')
      setLoading(false)
    }

    fetchPlaces()
  }, [])

  return (
    <div className="map-body">
      <Navbar />
      <div className="map-header">
        <div className="map-header-text">
          <h1>Hospitals in Bangladesh</h1>
          <p>Find hospitals across Bangladesh</p>
        </div>
        <div className="map-legend">
          <span className="legend-item">
            <img
              src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png"
              alt="hospital"
            />
            Hospitals ({hospitals.length})
          </span>
        </div>
      </div>

      {loading && (
        <div className="map-loading">
          <div className="map-loading-spinner"></div>
          <p>Loading hospitals across Bangladesh...</p>
        </div>
      )}

      {error && (
        <div className="map-error">{error}</div>
      )}

      {!loading && !error && (
        <div className="map-wrapper">
          <MapContainer
            center={[23.685, 90.3563]}
            zoom={7}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <LocationMarker />
            
            {hospitals.length > 0 && (
              <FitBounds places={hospitals} />
            )}
            {hospitals.map(h => (
              <Marker key={`h-${h.id}`} position={[h.lat, h.lon]} icon={hospitalIcon}>
                <Popup>
                  <div className="map-popup">
                    <span className="map-popup-tag hospital">Hospital</span>
                    <h3>{h.name}</h3>
                    <p><strong>Address:</strong> {h.address}</p>
                    <p><strong>Phone:</strong> {h.phone}</p>
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${h.lat}&mlon=${h.lon}#map=17/${h.lat}/${h.lon}`}
                      target="_blank"
                      rel="noreferrer"
                      className="map-popup-link"
                    >
                      View on OpenStreetMap
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  )
}

export default MapPage