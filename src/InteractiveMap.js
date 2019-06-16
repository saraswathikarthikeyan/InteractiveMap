import React, {Component} from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import './InteractiveMap.css';
import  { GET_COUNTRY_API } from './Constants.js';
import Loader from 'react-loader-spinner'

//Country position to show marker on Google Map
const Locations = [{country:'US', lat: 37.090240, lng: -95.712891},
{country:'AF', lat:33.939110, lng: 67.709953},
{country:'BE', lat: 50.845539, lng: 4.355710},
{country:'CN', lat: 35.861660, lng: 104.195396},
{country:'IN', lat: 20.593683, lng: 78.962883},
{country:'NZ', lat: -40.900558, lng: 174.885971},
{country:'FI', lat: 61.924110, lng: 25.748152},
{country:'CA', lat: 56.130367, lng: -106.346771},
{country:'CH', lat: 46.818188, lng: 8.227512},
{country:'BR', lat: -15.779380, lng: -47.925739},
{country:'RU', lat: 61.524010, lng: 105.318756},
{country:'FR', lat: 46.227638, lng: 2.213749},
{country:'GB', lat: 55.378052, lng: -3.435973},
{country:'KE', lat: -0.023559, lng: 37.906193},
{country:'KZ', lat: 51.177601, lng: 71.432999},
{country:'AR', lat: -38.416096, lng: -63.616673}
];

//GraphL API URL
const url =  GET_COUNTRY_API;

export class InteractiveMap extends Component {

constructor(props) {
  super(props)

  this.state = {
    showingInfoWindow:false,
    showLoading:true,
    activeMarker: {},
    countryCode:'',
    responseData:null   
  }
  this.onMarkerClick = this.onMarkerClick.bind(this);
  this.onMapClick = this.onMapClick.bind(this);  
 
}

//Click on googe map Marker
onMarkerClick = (props, marker, e) => {  
  this.setState({           
    activeMarker: marker,
    showingInfoWindow: true,
    countryCode:props.name,
    showLoading:true
  }); 

  //Fetch the country Information calling the API. Sets the response in state.responseData
  fetchCountryInformation(this.state.countryCode).then(  data  => { this.setState({responseData:data, showLoading:false }); }, 
  error => {console.error(error); this.setState({ showLoading:false }) });      
}  

//Loop through the Locations for showing Marker
MarkLocations = () => {
  return Locations.map( (location,index) => {       
  return <Marker 
      key= {index} id= {index} name= {location.country}
      position = {{
          lng:location.lng, 
          lat:location.lat
      }}
      optimized={false}
      onClick = { this.onMarkerClick } />      
  } )        
}

//Click on any location on map other than marker
onMapClick = (props) => {  
  if (this.state.showingInfoWindow) {
    this.setState({
      showingInfoWindow: false,
      activeMarker: null
    });
  }
}      

render() {
return (  
    <div className="App-container">
      <Header/>
      <div id="mapContainer" >  
        <Map
          google={this.props.google}  
          style={{ height:'600px', position:'absolute'}}
          initialCenter={{ lat: 47.37861, lng: 8.54 } }
          zoom={3}
          onClick = { this.onMapClick } >
           { this.MarkLocations() }
           <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow} >   
            {  
              this.state.showLoading  ?  <ShowLoading />  :  <ShowCountryDetails data={this.state.responseData} />             
            }             
          </InfoWindow>      
        </Map>
      </div>
    </div>
  );
}
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCmuBkuXAIgn0HPxDR6qDdDB5gFlp5RNwE'
})(InteractiveMap)

//Loading window component
function ShowLoading() {
  return (
  <div id="loadingWindow" > 
   <Loader 
         type="Oval"
         color="#00BFFF"
         height="60"	
         width="60"
      />     
 </div>)
}

//Header component
function Header() {
  return(
    <header className="App-header">       
       <p>Welcome! Click on the location to know more details about the country.</p>
      </header>
  );
}

//Detail window component
function ShowCountryDetails(props) { 
 return(
   <div id="detailwindow">
     <h3>{ props.data.country.name }</h3>
     <label><b>Native:</b>{ props.data.country.native }</label><br />
     <label><b>Emoji:</b> { props.data.country.emoji }</label><br />
     <label><b>Currency:</b> { props.data.country.currency }</label><br />
     <label><b>Languages:</b> { props.data.country.languages.map(lang => " "+lang.name)  }</label>
    </div>
 )
}

//GraphQL query to fetch data based on selected country
const query = `
  query ($countryCode: String!) {
    country(code: $countryCode) {
    name
    native
    emoji
    currency
    languages {
        code
        name
    }
    }
  }
`;

//Function calls the GraphQL API to fetch Country Information
const fetchCountryInformation = (ccode) => {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { countryCode:  ccode  } }) } )
  .then(res =>  res.json() )  
  .then(data => data.data ) 
  .catch( error => { console.error(error);  } );
}