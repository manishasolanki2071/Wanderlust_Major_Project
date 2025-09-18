// Initialize Leaflet Map
const { latitude, longitude } = listingCoordinates;
// console.log(lat, lon); // Check if coordinates are correctly passed
var map = L.map("map").setView([latitude, longitude], 9); // Centered on India
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);
// Use a colored marker from https://github.com/pointhi/leaflet-color-markers
var redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
  iconSize: [25, 35],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
var marker = L.marker([latitude, longitude], {
  icon: redIcon,
}).addTo(map);
marker
  .bindPopup(
    `<b>${listingLocation}</b><br>Exact location provided after booking.`
  )
  .openPopup();
