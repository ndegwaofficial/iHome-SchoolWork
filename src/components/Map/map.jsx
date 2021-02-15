import React, { useState } from 'react';
import StoreCard from '../storeCard/storeCard.jsx'
import marker from './marker.png'
import Loading from '../loading/loading.jsx'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';


import './map.css'



const GoogleMap = (props) => {





    const [selectedStore, setSelectedStore] = useState({});
    const [showItems, setShowItems] = useState(false);
    const [alert, setAlert] = useState({ display: false, msg: "" })
    const [updateLoading, setUpdateLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const onMarkerClick = (props) => {
        setSelectedStore(props.store)
        setShowItems(true)
    }



    const onItemsClose = () => {
        setShowItems(false)
        setSelectedStore({});
        setAlert({ display: false, msg: "" })
        setUpdateLoading(false)
        setDeleteLoading(false)
    }

    const handleInputChange = (e) => {
        setSelectedStore({ ...selectedStore, [e.target.name]: e.target.value })
    }

    const handleItemChange = (prop, event, index) => {
        const old = selectedStore.items[index];
        const updated = { ...old, [prop]: event.target.value }
        const clone = [...selectedStore.items];
        clone[index] = updated;
        setSelectedStore({ ...selectedStore, items: clone })
    }



    const addItem = () => {
        const newItem = { name: "", quantity: "", price: "" };
        setSelectedStore({ ...selectedStore, items: selectedStore.items.concat(newItem) })
    }

    const deleteItem = (i) => {
        setSelectedStore({ ...selectedStore, items: selectedStore.items.filter((item, index) => index !== i) })
    }


    const deleteStore = () => {
        setAlert({ display: false, msg: "" })
        setDeleteLoading(true)
        fetch('https://covid-19-shopping.herokuapp.com/deletestore', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(selectedStore)
        })
            .then(response => response.json())
            .then(res => {
                if (Array.isArray(res)) {
                    props.handleStoreChange(res)
                    setDeleteLoading(false)
                    setShowItems(false)
                } else {
                    console.log("Bad response from server")
                    setAlert({ display: true, msg: res })
                    setDeleteLoading(false)
                }
            })
            .catch(() => {
                setAlert({ display: true, msg: "could not get a response from the server" })
                setDeleteLoading(false)
            })
    }


    const isStoreValid = selectedStore.name && selectedStore.type && selectedStore.items.every(i => Object.values(i).every(v => v)) && selectedStore.items.length > 0;

    const onStoreEdit = () => {
        setAlert({ display: false, msg: "" })
        if (isStoreValid) {
            setUpdateLoading(true)
            fetch('https://covid-19-shopping.herokuapp.com/editstore', {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedStore)
            }).then(response => response.json())
                .then(res => {
                    if (Array.isArray(res)) {
                        props.handleStoreChange(res)
                        setShowItems(false)
                        setUpdateLoading(false)
                    } else {
                        setAlert({ display: true, msg: res })
                        setUpdateLoading(false)
                    }
                })
                .catch(() => {
                    setAlert({ display: true, msg: "could not get a response from the server" })
                    setUpdateLoading(false)
                })
        } else {
            setAlert({ display: true, msg: "Please fill all the empty inputs before updating" })
        }

    }



    const mapStyles = {
        width: '100vw',
        height: 'calc(100vh - 60px)',
    };


    return (
        <>
            <div className="map-out-div">
                <Map
                    className="map-wrapper"
                    google={props.google}
                    onClick={props.mapClick}
                    zoom={16}
                    minZoom={3}
                    style={mapStyles}
                    initialCenter={{ lat: -0.394765, lng: 36.961930 }}
                    styles = {[
                        {
                            "featureType": "administrative",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "color": "#444444"
                                }
                            ]
                        },
                        {
                            "featureType": "administrative.country",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "visibility": "on"
                                },
                                {
                                    "color": "#00ff35"
                                },
                                {
                                    "lightness": "-72"
                                },
                                {
                                    "weight": "2.52"
                                }
                            ]
                        },
                        {
                            "featureType": "administrative.country",
                            "elementType": "labels",
                            "stylers": [
                                {
                                    "color": "#2bac45"
                                },
                                {
                                    "weight": "3.70"
                                }
                            ]
                        },
                        {
                            "featureType": "administrative.country",
                            "elementType": "labels.text.fill",
                            "stylers": [
                                {
                                    "lightness": "9"
                                },
                                {
                                    "weight": "0.85"
                                }
                            ]
                        },
                        {
                            "featureType": "administrative.country",
                            "elementType": "labels.text.stroke",
                            "stylers": [
                                {
                                    "color": "#000000"
                                },
                                {
                                    "weight": "3.47"
                                }
                            ]
                        },
                        {
                            "featureType": "administrative.province",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "visibility": "on"
                                },
                                {
                                    "color": "#00ff35"
                                },
                                {
                                    "weight": "1.25"
                                },
                                {
                                    "lightness": "-59"
                                }
                            ]
                        },
                        {
                            "featureType": "administrative.locality",
                            "elementType": "labels",
                            "stylers": [
                                {
                                    "visibility": "on"
                                }
                            ]
                        },
                        {
                            "featureType": "landscape",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "color": "#f2f2f2"
                                }
                            ]
                        },
                        {
                            "featureType": "landscape.natural.landcover",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "visibility": "on"
                                },
                                {
                                    "color": "#ff0000"
                                }
                            ]
                        },
                        {
                            "featureType": "poi",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "poi.attraction",
                            "elementType": "labels",
                            "stylers": [
                                {
                                    "visibility": "on"
                                }
                            ]
                        },
                        {
                            "featureType": "poi.attraction",
                            "elementType": "labels.icon",
                            "stylers": [
                                {
                                    "color": "#dd1414"
                                }
                            ]
                        },
                        {
                            "featureType": "poi.business",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "visibility": "on"
                                }
                            ]
                        },
                        {
                            "featureType": "poi.government",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "visibility": "on"
                                }
                            ]
                        },
                        {
                            "featureType": "poi.medical",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "visibility": "on"
                                }
                            ]
                        },
                        {
                            "featureType": "poi.park",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "visibility": "on"
                                }
                            ]
                        },
                        {
                            "featureType": "poi.park",
                            "elementType": "geometry.fill",
                            "stylers": [
                                {
                                    "color": "#00ff35"
                                },
                                {
                                    "lightness": "-77"
                                }
                            ]
                        },
                        {
                            "featureType": "poi.park",
                            "elementType": "labels",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "poi.school",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "visibility": "on"
                                }
                            ]
                        },
                        {
                            "featureType": "poi.sports_complex",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "road",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "saturation": -100
                                },
                                {
                                    "lightness": 45
                                },
                                {
                                    "visibility": "on"
                                },
                                {
                                    "color": "#00ff35"
                                }
                            ]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "visibility": "on"
                                },
                                {
                                    "color": "#00ff35"
                                },
                                {
                                    "lightness": "-30"
                                },
                                {
                                    "saturation": "59"
                                }
                            ]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "visibility": "on"
                                },
                                {
                                    "lightness": "-58"
                                }
                            ]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "labels",
                            "stylers": [
                                {
                                    "visibility": "simplified"
                                },
                                {
                                    "color": "#0ad72e"
                                },
                                {
                                    "weight": "0.52"
                                }
                            ]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "labels.text.stroke",
                            "stylers": [
                                {
                                    "color": "#000000"
                                },
                                {
                                    "weight": "1.95"
                                }
                            ]
                        },
                        {
                            "featureType": "road.arterial",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "visibility": "simplified"
                                },
                                {
                                    "color": "#00ff35"
                                },
                                {
                                    "lightness": "-70"
                                }
                            ]
                        },
                        {
                            "featureType": "road.arterial",
                            "elementType": "labels",
                            "stylers": [
                                {
                                    "visibility": "simplified"
                                }
                            ]
                        },
                        {
                            "featureType": "road.arterial",
                            "elementType": "labels.icon",
                            "stylers": [
                                {
                                    "visibility": "simplified"
                                }
                            ]
                        },
                        {
                            "featureType": "road.local",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "visibility": "simplified"
                                }
                            ]
                        },
                        {
                            "featureType": "road.local",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "visibility": "simplified"
                                },
                                {
                                    "color": "#00ff35"
                                },
                                {
                                    "lightness": "-58"
                                },
                                {
                                    "weight": "0.93"
                                }
                            ]
                        },
                        {
                            "featureType": "road.local",
                            "elementType": "labels",
                            "stylers": [
                                {
                                    "visibility": "on"
                                },
                                {
                                    "color": "#000000"
                                },
                                {
                                    "weight": "0.05"
                                }
                            ]
                        },
                        {
                            "featureType": "transit",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "water",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "color": "#46bcec"
                                },
                                {
                                    "visibility": "on"
                                }
                            ]
                        }
                    ]
                    }
                >
                    {JSON.stringify(props.currentStore) !== '{}' && <Marker position={props.currentStore.coords} />}

                    {props.stores.map((store, i) => {
                        return (
                            <Marker icon={{ url: marker, scaledSize: new props.google.maps.Size(50, 40) }} key={i} user={props.user} store={store} position={store.coords} onClick={(props) => onMarkerClick(props)} />
                        )
                    })}

                    {showItems && <StoreCard updateLoading={updateLoading} deleteLoading={deleteLoading} alert={alert} deleteStore={deleteStore} onStoreEdit={onStoreEdit} deleteItem={deleteItem} addItem={addItem} handleItemChange={handleItemChange} handleChange={handleInputChange} onItemsClose={onItemsClose} store={selectedStore} user={props.user} />
                    }
                </Map>

            </div>

            {showItems && <StoreCard updateLoading={updateLoading} deleteLoading={deleteLoading} alert={alert} deleteStore={deleteStore} onStoreEdit={onStoreEdit} deleteItem={deleteItem} addItem={addItem} handleItemChange={handleItemChange} handleChange={handleInputChange} onItemsClose={onItemsClose} store={selectedStore} user={props.user} />
            }
        </>
    );
}



export default GoogleApiWrapper({
    apiKey: 'AIzaSyDy2jfdK5Th62DXH6kWNavGF-XlfVuXVew',
    LoadingContainer: (Loading)
})(GoogleMap);


