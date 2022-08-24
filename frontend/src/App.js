import React, { useRef, useCallback } from "react";
import Map, { GeolocateControl, Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { LocationOn, Star } from "@material-ui/icons";
import "./app.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";

import Register from "./components/Register";
import Login from "./components/Login";

export default function App() {
    const myStorage = window.localStorage;
    const mapRef = useRef(null);
    const currentLocation = useRef(null);
    const onSelectCity = useCallback(({ longitude, latitude }) => {
        mapRef.current?.flyTo({
            center: [longitude, latitude],
            duration: 2000,
        });
        console.log(longitude);
        console.log(latitude);
    }, []);

    const [currentUser, setCurrentUser] = useState(null);
    const [viewport, setViewport] = useState({
        latitude: 37.2768,
        longitude: 9.8642,
        zoom: 14,
    });
    const [pins, setPins] = useState([]);
    const [currentPlaceId, setCurrentPlaceId] = useState(
        myStorage.getItem("user")
    );
    const [newPlace, setNewPlace] = useState(null);
    const [title, setTitle] = useState(null);
    const [desc, setDesc] = useState(null);
    const [rating, setRating] = useState(0);
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

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

        onSelectCity({ latitude: latt, longitude: longg });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newPin = {
            username: currentUser,
            title,
            desc,
            rating,
            lat: newPlace.longe,
            long: newPlace.latt,
        };
        try {
            const res = await axios.post("/pins", newPin);
            setPins([...pins, res.data]);
            setNewPlace(null);
        } catch (error) {
            console.log(error);
        }
    };
    const handleLogout = () => {
        myStorage.removeItem("user");
        setCurrentUser(null);
    };
    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <Map
                initialViewState={viewport}
                ref={mapRef}
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
                            offsetLeft={-viewport.zoom * 3.5}
                            offsetTop={-viewport.zoom * 7}
                        >
                            <LocationOn
                                style={{
                                    fontSize: viewport.zoom * 7,
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
                                        {Array(p.rating).fill(
                                            <Star className="stars" />
                                        )}
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
                        anchor="center"
                        onClose={() => setNewPlace(null)}
                    >
                        <div>
                            <form onSubmit={handleSubmit}>
                                <label>esm l7anout</label>
                                <input
                                    placeholder="esm l7anout"
                                    onChange={(e) => setTitle(e.target.value)}
                                ></input>
                                <label>chnowa chrit w b9adech</label>
                                <textarea
                                    placeholder="chnowa sar"
                                    onChange={(e) => setDesc(e.target.value)}
                                />
                                <label>a3tih note</label>
                                <select
                                    onChange={(e) => setRating(e.target.value)}
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                                <button className="submitButton" type="submit">
                                    ab3ath
                                </button>
                            </form>
                        </div>
                    </Popup>
                )}
                {currentUser ? (
                    <button className="button logout" onClick={handleLogout}>
                        Logout
                    </button>
                ) : (
                    <div className="buttons">
                        <button
                            className="button login"
                            onClick={() => setShowLogin(true)}
                        >
                            Login
                        </button>
                        <button
                            className="button register"
                            onClick={() => setShowRegister(true)}
                        >
                            Register
                        </button>
                    </div>
                )}
                {showRegister && <Register setShowRegister={setShowRegister} />}
                {showLogin && (
                    <Login
                        setShowLogin={setShowLogin}
                        myStorage={myStorage}
                        setCurrentUser={setCurrentUser}
                    />
                )}
                <GeolocateControl
                    ref={currentLocation}
                    style={{ position: "absolute", right: "1460px" }}
                />
            </Map>

            <div className="aboutus">
                <h1>About us</h1>
            </div>
        </div>
    );
}
