
var map;
var markers = [];
var infowindowList;


//make AJAX call to foursquare API
var result = function(){
  var bounds = new google.maps.LatLngBounds();
  infowindowList = new google.maps.InfoWindow();
  var myAddress = "383 Springfield Ave, Newark NJ 07103";
  var foursquareUrl2 = "https://api.foursquare.com/v2/venues/search?limit=80&near=" + myAddress + "&client_id=RMJLP0XC1CPMPOE4IINGN4RSBFUVTP10D1N0OO0RLBCCNPFK&client_secret=2OAXA5CSE43HQRNUYEEFV2FYR3SLB3CHVN0FCLXEGIUVCUUP&v=20170801";

  $.getJSON(foursquareUrl2, function(data){
    var resultParsed = data.response.venues;
    for (var i = 0; i < resultParsed.length; i++) {
      var resp = resultParsed[i]; var llresp = resp.location;
      if (resp.contact.formattedPhone && resp.name.length <= 12) {
        var maklocation = {lat: llresp.lat, lng: llresp.lng};
        var makaddress = llresp.formattedAddress;
        var maktitle = resp.name;
        var makphone = resp.contact.formattedPhone;
        var makstats = "checkinsCount :  " +  resp.stats.checkinsCount + ",  "  + "  usersCount :  " + resp.stats.usersCount;
        var marker = new google.maps.Marker({
          position: maklocation,
          map: map,
          name: maktitle,
          animation: google.maps.Animation.DROP,
          cursor: "<h4>" + maktitle + "</h4>" + makaddress + "<br>" + makphone + "<br>" + makstats + "<br>" + "source: Foursquare API",
          id: i
        });
        markers.push(marker);
        bounds.extend(marker.position);
        showInfoWindow(marker);
      }

      map.fitBounds(bounds);
    }
    google.maps.event.addDomListener(window, "resize", function() {
      map.fitBounds(bounds);
    });
    ko.applyBindings(new ViewModel());
  }).fail(function(xhr, errorType, exception) {
    alert( "Failed to connect to Foursquare API : " + xhr.textstatus + " " + errorType + "\n " + exception);
  });
  return markers;
};



function initMap() {
  var mapOptions = {
    zoom: 10,
    center: new google.maps.LatLng(40.733553, -74.196379)
  };
  result();
  var mapDocument = document.getElementById("mm");
  map = new google.maps.Map(mapDocument, mapOptions);
}

function MapError() {
  alert("Google Map error.");
}


function showInfoWindow(marker) {
  marker.addListener("click", () => {
    infowindowList.setContent(marker.cursor);
    infowindowList.open(map, marker);
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(() => {marker.setAnimation(null);}, 1400);
  });
}


var ViewModel = function () {
  this.query1 = ko.observable("");
  this.allMarker = ko.observableArray([]);
  this.initialXClass = ko.observable(false);
  this.toggleXClass = () => {
    this.initialXClass(!this.initialXClass());
  };


  markers.forEach((item) => {
    this.allMarker.push(item);
  });


  this.bounceMarker = (marker) => {
    infowindowList.setContent(marker.cursor);
    infowindowList.open(map, marker);
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(() => {marker.setAnimation(null);}, 1400);
  };


  this.visibleMarkers = () => {
		this.allMarker().forEach((marker) => {
			marker.setVisible(true);
		});
	};



  this.filterPlace = ko.computed(() => {
    var myFilter = this.query1().toLowerCase();
    if (!myFilter) {
      this.visibleMarkers();
      return this.allMarker();
    } else {
       return ko.utils.arrayFilter(this.allMarker(),(item) => {
        if (item.name.toLowerCase().indexOf(myFilter) >= 0) {
          item.setVisible(true);
          return true;
        } else {
          infowindowList.close(map, item);
          item.setVisible(false);
          return false;
        }
      });
    }
  });
};
