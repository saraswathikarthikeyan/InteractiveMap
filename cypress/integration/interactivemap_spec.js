import 'cypress-react-unit-test';
import React from 'react'
//import InteractiveMap from  './../../src/InteractiveMap';

describe('My First Test', function() {
    it('Does not do much!', function() {
      expect(true).to.equal(true)
    })
  })

  //Test website is loaded
  describe('Interactive Map website ', function() {
    it('Successfully loads interactive map website', function() { 
      cy.visit('/')     

      // Test for header and its text
      cy.get('header').should('have.class', 'App-header')
      .get('p').should('have.text', 'Welcome! Click on the location to know more details about the country.')

       //Test map is loaded
       cy.get('#mapContainer').find('map')

       //Test Markers are loaded 
       cy.get('#mapContainer').find('map#gmimap0')

      })
    })    

    //Test the GraphQL API
   describe('Fetch country details - calling Graphql API', function() {    
      it('To test the Spy function', function() {
      let obj = {
        fetchCountryInformation() {},
      }      
      let spy = cy.spy(obj, 'fetchCountryInformation').as('BE')      
      obj.fetchCountryInformation();      
      expect(spy).to.be.called
    });

    it('Successfully fetched data from graphQL API', function() { 
      cy.request({
        url: 'https://countries.trevorblades.com',
        method: 'POST',
        body: {
        query:
          'query ($countryCode: String!) {  country(code: $countryCode) {name native emoji currency languages { code name } } }',
            variables: {  countryCode:  'CH' },
        },
      })
      .then(resp => {
        // assert response from server
        expect(resp.status).to.eq(200);
        expect(resp.body).to.have.property('data')
        assert.isObject(resp.body, 'value is object')

        expect(resp.body).to.have.property('data')
        .to.have.property('country')
        .to.have.property('name','Switzerland')
    })
  });
});
 