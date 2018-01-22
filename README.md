# Neighborhood-Places
# Few Important locations in my neighborhood
# Introduction :
- This application is single page responsive application featuring a map of my  neighborhood in Newark, New Jersey. The application highlight few important places within the neighborhood:
  - CityPlex 12 Movie theatre
  - Family Dollar
  - Walgreens
  - Home Depot

- Using Foursquare Places API, the application dynamically uploads and updates the navigation bar and google maps marker with names and other useful information about location in my neighborhood.

Clicking on the map's marker will show an infowindow with the location's information such as:
   - name
   - Address
   - Phone Number
   - Web Address
   - stats:
      - checkinsCount
      - tipCount
      - usersCount

- Other functionality includes ability to display these information on mouseover and search functionality.

- Required Libraries and dependencies:
  - KnockoutJs
  - Google Maps API
  - Bootstrap
  - Foursquare API
  - jQuery

- Project Contents:
  - index.html
  - styles.css
  - application.js


# Installation Instructions :
- Open `index.html` using a web browser. This will load the application.

# Operating Instructions:
- Once loaded, the application will display:
    - A googlemap with markers identifying the locations in the neighborhood
    - A sidebar with list of locations.
    - clicking on the name of location will animate its marker on the map
    - An input box. This box can be used to filter and search through the list of locations for display on the map.

Hovering, clicking on the name of the location on the sidebar or search for location using the input box with display the location on the map as marker with infowindow.

This application is fully responsive across all web browsers and screen sizes.

[Github link](https://jocoder22.github.io/Neighborhood-Places/.)
