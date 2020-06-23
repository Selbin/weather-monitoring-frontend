import React, { useState } from 'react'
import './App.css'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { structureData, createTempStr, fetchData } from './helper/helper'

const baseUrl = 'http://localhost:8000/weather'

function App () {
  const [filter, setFilter] = useState(0)
  const [marker, setMarker] = useState(null)

  const MapContainer = () => {
    const mapStyles = {
      height: '100vh',
      width: '100%'
    }

    const defaultCenter = {
      lat: 10.8505,
      lng: 76.2711
    }

    return (
      <LoadScript googleMapsApiKey='AIzaSyCFj_B1Ic6pv9uB7OQlLU6OOa9gvdRlJus'>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={7}
          center={defaultCenter}
        >
          {marker === null
            ? null
            : marker.map((marker, i) => {
              return (
                <Marker
                  position={{ lat: marker.lat, lng: marker.long }}
                  key={i}
                  title={createTempStr(marker.data)}
                />
              )
            })}
        </GoogleMap>
      </LoadScript>
    )
  }

  const filteredFields = filter => {
    if (filter === 0) {
      return (
        <div id='container'>
          <LocationField />
          <Date />
          <TimeField />
          <LowTempField />
          <HighTempField />
          <SubmitButton />
        </div>
      )
    }

    if (filter === 1) {
      return (
        <div id='container'>
          <TimeField />
          <LowTempField />
          <HighTempField />
          <SubmitButton />
        </div>
      )
    }

    if (filter === 2) {
      return (
        <div id='container'>
          <LocationField />
          <LowTempField />
          <HighTempField />
          <SubmitButton />
        </div>
      )
    }
  }

  const Date = () => (
    <input type='date' id='date' min='2020-06-22' max='2020-06-27' />
  )
  const FilterField = () => (
    <div id='filter'>
      <label for='Filter'>Filter: </label>
      <select
        name='Filter'
        id='Filter'
        value={filter}
        onChange={event => {
          setFilter(Number(event.target.value))
        }}
      >
        <option value='0'>Date-Time-Location-Temp range filter</option>
        <option value='1'>Time-Temp range filter</option>
        <option value='2'>Location-Temp range filter</option>
      </select>
    </div>
  )

  const LocationField = () => (
    <div>
      <label for='Location'>Location: </label>
      <select name='location' id='location'>
        <option value='Thrissur'>Thrissur</option>
        <option value='Kollam'>Kollam</option>
        <option value='Kottayam'>Kottayam</option>
        <option value='Trivandrum'>Trivandrum</option>
        <option value='Kochi'>Kochi</option>
      </select>
    </div>
  )

  const TimeField = () => (
    <div>
      <label for='Time'>Time: </label>
      <select name='Time' id='Time'>
        <option value='0'>12 AM</option>
        <option value='3'>3 AM</option>
        <option value='6'>6 Am</option>
        <option value='9'>9 AM</option>
        <option value='12'>12 PM</option>
        <option value='15'>3 PM</option>
        <option value='18'>6 PM</option>
        <option value='21'>9 PM</option>
      </select>
    </div>
  )

  const LowTempField = () => (
    <div>
      <label for='Low Temp'>Low temp: </label>
      <input type='Number' id='Low Temp' />
    </div>
  )

  const HighTempField = () => (
    <div>
      <label for='High Temp'>High temp: </label>
      <input type='Number' id='High Temp' />
    </div>
  )
  const SubmitButton = () => (
    <input
      type='submit'
      onClick={async event => {
        const lowTemp = document.getElementById('Low Temp').value
        const highTemp = document.getElementById('High Temp').value
        if (filter === 0) {
          const time = document.getElementById('Time').value
          const location = document.getElementById('location').value
          const appendZero = time.length === 1 ? '0' : ''
          const dateStr =
            document.getElementById('date').value +
            ' ' +
            appendZero +
            time +
            ':00:00'
          const url = `/info/${dateStr}/${location}/${lowTemp}/${highTemp}`
          const response = await fetchData(
            baseUrl + url,
            'get',
            'application/json'
          )
          const result = await response.json()
          const mappedData = structureData(result)
          setMarker(mappedData)
        }
        if (filter === 1) {
          const time = document.getElementById('Time').value
          const url = `/location/${time}/${lowTemp}/${highTemp}`
          const response = await fetchData(
            baseUrl + url,
            'get',
            'application/json'
          )
          const result = await response.json()
          const mappedData = structureData(result)
          setMarker(mappedData)
        }
        if (filter === 2) {
          const location = document.getElementById('location').value
          const url = `/time/${location}/${lowTemp}/${highTemp}`
          const response = await fetchData(
            baseUrl + url,
            'get',
            'application/json'
          )
          const result = await response.json()
          const mappedData = structureData(result)
          setMarker(mappedData)
        }
      }}
    />
  )

  return (
    <div className='App'>
      <FilterField />
      {filteredFields(filter)}
      <MapContainer />
    </div>
  )
}

export default App
