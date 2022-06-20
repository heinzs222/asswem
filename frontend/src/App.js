import * as React from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { LocationOn, Star } from "@material-ui/icons";
import "./app.css";
import { useRef, useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

function App() {
    const currentUser = "jane";
    const [pins, setPins] = useState([]);
    const [currentPlaceId, setCurrentPlaceId] = useState(null);
    const [newPlace, setNewPlace] = useState(null);
    const [viewport, setViewPort] = useState({
        width: "100vw",
        height: "100vh",
        longitude: 9.8642,
        latitude: 37.2768,
        zoom: 14,
    });
    useEffect(() => {
        const getPins = async () => {
            try {
                const res = await axios.get("/pins");
                setPins(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getPins();
    }, []);
    const handleMarkerClick = (id, latt, longe) => {
        setCurrentPlaceId(id);
    };
    const handleAddClick = (e) => {
        const latt = e.lngLat.lat;
        const longe = e.lngLat.lng;
        setNewPlace({
            latt,
            longe,
        });
    };

    return (
        <Map
            initialViewState={{
                longitude: 9.8642,
                latitude: 37.2768,
                zoom: 14,
            }}
            style={{ width: "100wh", height: "100vh" }}
            mapboxAccessToken={process.env.REACT_APP_MAPBOX}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            onDblClick={handleAddClick}
        >
            {pins.map((p) => (
                <>
                    <Marker
                        longitude={p.lat}
                        latitude={p.long}
                        offsetLeft={-20}
                        offsetTop={-10}
                    >
                        <LocationOn
                            style={{
                                color:
                                    p.username === currentUser
                                        ? "tomato"
                                        : "slateblue",
                                cursor: "pointer",
                            }}
                            onClick={() =>
                                handleMarkerClick(p._id, p.latt, p.longe)
                            }
                        />
                    </Marker>
                    {p._id === currentPlaceId && (
                        <Popup
                            longitude={p.lat}
                            latitude={p.long}
                            closeButton={true}
                            closeOnClick={false}
                            anchor="left"
                            onClose={() => setCurrentPlaceId(null)}
                        >
                            <div className="card">
                                <label>Ism l7anout</label>
                                <h4 className="place"> {p.title}</h4>
                                <label>chnowa chrit w b9adech</label>
                                <p className="desc">{p.desc}</p>
                                <label>a3tih note</label>
                                <div className="stars">
                                    <Star className="stars" />
                                    <Star className="stars" />
                                    <Star className="stars" />
                                    <Star className="stars" />
                                    <Star className="stars" />
                                </div>

                                <label>Information</label>
                                <span className="username">
                                    Created by <b>{p.username}</b>
                                </span>
                                <span className="date">
                                    {format(p.createdAt)}
                                </span>
                            </div>
                        </Popup>
                    )}
                </>
            ))}
            {newPlace && (
                <Popup
                    longitude={newPlace.longe}
                    latitude={newPlace.latt}
                    closeButton={true}
                    closeOnClick={false}
                    anchor="left"
                    onClose={() => setNewPlace(null)}
                >
                    hello
                </Popup>
            )}
        </Map>
    );
}
export default App;
