import React, { Component } from "react";
import Map, { Marker, Popup, MapRef } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { LocationOn, Star } from "@material-ui/icons";
import "./app.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import mapboxgl from "mapbox-gl";
import { useRef, useCallback } from "react";
import { render } from "react-dom";

const initialViewState = {
    latitude: 37.7751,
    longitude: -122.4193,
    zoom: 11,
    bearing: 0,
    pitch: 0,
};
function App() {
    const mapRef = useRef < Map > null;

    const onSelectCity = useCallback(({ longitude, latitude }) => {
        mapRef.current?.flyTo({
            center: [longitude, latitude],
            duration: 2000,
        });
    }, []);

    const currentUser = "hatem";
    const [viewport, setViewport] = useState({
        latitude: 37.2768,
        longitude: 9.8642,
        zoom: 14,
    });
    const [pins, setPins] = useState([]);
    const [currentPlaceId, setCurrentPlaceId] = useState(null);
    const [newPlace, setNewPlace] = useState(null);

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
    const handleMarkerClick = (id, latt, longg) => {
        setCurrentPlaceId(id);
        setViewport({ latitude: latt, longitude: longg });
    };
    const handleAddClick = (e) => {
        const latt = e.lngLat.lat;
        const longe = e.lngLat.lng;
        e.target.doubleClickZoom._clickZoom._enabled = false;
        setNewPlace({
            latt,
            longe,
        });
    };

    return (
        <Map
            ref={mapRef}
            {...viewport}
            style={{ width: "100wh", height: "100vh" }}
            mapboxAccessToken={process.env.REACT_APP_MAPBOX}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            onDblClick={handleAddClick}
            onDrag={setViewport}
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
                                handleMarkerClick(p._id, p.long, p.lat)
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
                <Marker
                    longitude={newPlace.longe}
                    latitude={newPlace.latt}
                    closeButton={true}
                    closeOnClick={false}
                    anchor="center"
                    onClose={() => setNewPlace(null)}
                >
                    <LocationOn />
                </Marker>
            )}
        </Map>
    );
}
export default App;
