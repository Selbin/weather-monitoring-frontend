import React, { useState } from 'react'
import './App.css'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

const baseUrl = 'http://localhost:8000/weather'

const structureData = result => {
  const mappedData = {}
  result.data.forEach(element => {
    if (mappedData[element.name]) {
      mappedData[element.name].data.push({
        dateStr: element.dateString,
        temp: element.temp
      })
    } else {
      mappedData[element.name] = {
        location: element.name,
        lat: element.lat,
        long: element.long,
        data: [{ dateStr: element.dateString, temp: element.temp }]
      }
    }
  })
  const dataArr = []
  for (const location in mappedData) {
    dataArr.push(mappedData[location])
  }
  return dataArr
}

const createTempStr = data => {
  let tempStr = ''
  data.forEach(tempInfo => {
    tempStr = tempStr + tempInfo.dateStr + ' : ' + tempInfo.temp + '\xB0 C\r\n'
  })
  console.log(tempStr)
  return tempStr
}

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

function App () {
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
        >
          {marker === null
            ? null
            : marker.map((marker, i) => {
              return (
                <Marker
                  position={{ lat: marker.lat, lng: marker.long }}
                  key={i}
                  title={createTempStr(marker.data)}
                  // `Temperature: ${marker.temp}\xB0 C`
                />
              )
            })}
        </GoogleMap>
      </LoadScript>
    )
  }
  const [filter, setFilter] = useState(0)
  const [marker, setMarker] = useState(null)
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

  return (
    <div className='App'>
      <FilterField />
      {filteredFields(filter)}
      <MapContainer />
    </div>
  )
}

export default App
