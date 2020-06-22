import React, { useState } from 'react'
import './App.css'
import { GoogleMap, LoadScript } from '@react-google-maps/api'

const baseUrl = 'http://localhost:8000/weather'
let timeout = null

// function to dynamically provide arguments to fetch
async function fetchData (url, method, header, body) {
  const response = await window.fetch(url, {
    method,
    headers: {
      'Content-Type': header
    },
    body
  })
  return response
}

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
        zoom={13}
        center={defaultCenter}
      />
    </LoadScript>
  )
}

function App () {
  const [location, setLocation] = useState('Thrissur')
  const [filter, setFilter] = useState(0)
  const [time, setTime] = useState(0)

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
    <input
      type='date'
      min='2020-06-22'
      max='2020-06-25'
      onClick={event => { 
      }}
    />
  )
  const SubmitButton = () => (
    <input
      type='submit'
      onClick={async event => {
        if (filter === 0) {
          const url = `/info/1593151200000/${location}/${document.getElementById('Low Temp').value}/${document.getElementById('High Temp').value}`
          console.log(
            await (
              await fetchData(baseUrl + url, 'get', 'application/json')
            ).json()
          )
        }
        if (filter === 1) {
          const url = `/location/${time}/${document.getElementById('Low Temp').value}/${document.getElementById('High Temp').value}`
          console.log(
            await (
              await fetchData(baseUrl + url, 'get', 'application/json')
            ).json()
          )
        }
        if (filter === 2) {
          const url = `/time/${location}/${document.getElementById('Low Temp').value}/${document.getElementById('High Temp').value}`
          console.log(
            await (
              await fetchData(baseUrl + url, 'get', 'application/json')
            ).json()
          )
        }
      }}
    />
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
      <select
        name='location'
        id='location'
        value={location}
        onChange={event => {
          setLocation(event.target.value)
        }}
      >
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
      <select
        name='Time'
        id='Time'
        value={time}
        onChange={event => {
          setTime(Number(event.target.value))
        }}
      >
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
      <input
        type='Number'
        id='Low Temp'
        // onChange={event => {
        //   document.getElementById('Low Temp').setAttribute('value', event.target.value)
        //   console.log(document.getElementById('Low Temp'))
        //   setLowTemp(Number(event.target.value))

        // }}
      />
    </div>
  )

  const HighTempField = () => (
    <div>
      <label for='High Temp'>High temp: </label>
      <input
        type='Number'
        id='High Temp'
        // onKeyUp={event => {
        //   clearTimeout(timeout)
        //   timeout = setTimeout(function () {
        //     setHighTemp(Number(event.target.value))
        //   }, 1000)
        //   event.persist()
        // }}
      />
    </div>
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
