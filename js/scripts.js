

var map;
var markers = [];

//make AJAX call to foursquare API
var result = function(){
  var bounds = new google.maps.LatLngBounds();
  var infowindowList = new google.maps.InfoWindow();
  var myAddress = '383 Springfield Ave, Newark NJ 07103';
  var foursquareUrl2 = 'https://api.foursquare.com/v2/venues/search?limit=80&near=' + myAddress + '&client_id=RMJLP0XC1CPMPOE4IINGN4RSBFUVTP10D1N0OO0RLBCCNPFK&client_secret=2OAXA5CSE43HQRNUYEEFV2FYR3SLB3CHVN0FCLXEGIUVCUUP&v=20170801';

  $.getJSON(foursquareUrl2, function(data){
    var resultParsed = data.response.venues;
    for (var i = 0; i < resultParsed.length; i++) {
      var resp = resultParsed[i]; var llresp = resp.location;
      if (resp.contact.formattedPhone && resp.name.length <= 16) {
        var maklocation = {lat: llresp.lat, lng: llresp.lng};
        var makaddress = llresp.formattedAddress;
        var maktitle = resp.name;
        var makphone = resp.contact.formattedPhone;
        var makstats = "checkinsCount : " +  resp.stats.checkinsCount + ", " + " tipCount : " + resp.stats.tipCount + ", " + " usersCount : " + resp.stats.usersCount;
        var marker = new google.maps.Marker({
          position: maklocation,
          map: map,
          name: maktitle,
          animation: google.maps.Animation.DROP,
          cursor: '<h4>' + maktitle + '</h4>' + makaddress + '<br>' + makphone + '<br>' + makstats + '<br>' + "source: Foursquare API",
          id: i
        });
        if(markers.length == 8){return false;}
        markers.push(marker);
        bounds.extend(marker.position);
        showInfoWindow(marker, infowindowList);
      }
      map.fitBounds(bounds);
    }
  }).fail(function(xhr, errorType, exception) {
    alert( "Failed to connect to Foursquare API : " + xhr.textstatus + " " + errorType + "\n " + exception);
  });
  return markers;
}


function initMap() {
  map = new google.maps.Map(document.getElementById('mm'))
  result();
}

function MapError() {
  alert("Google Map error.");
}

function showInfoWindow(marker, infowindowList) {
  marker.addListener('click', function(){
    infowindowList.setContent(marker.cursor);
    infowindowList.open(map, marker);
  });
  marker.addListener('mouseout', function(){
    infowindowList.close(map, marker);
  });
}

var ViewModel = function () {
  var self = this;
  self.query1 = ko.observable('');
  self.allMarker = ko.observableArray(markers);
  self.initialXClass = ko.observable(false);
  self.toggleXClass = function () {
    this.initialXClass(!this.initialXClass());
  };

  self.bounceMarker = function (marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function () {marker.setAnimation(null);}, 1400);
  }

  self.filterPlace = ko.computed(function () {
    var myFilter = self.query1().toLowerCase();
    if (!myFilter) {
      return self.allMarker();
    } else {
      return ko.utils.arrayFilter(self.allMarker(), function (item) {
        return item.name.toLowerCase().indexOf(myFilter) >=0;
      });
    }
  });
};

ko.applyBindings(new ViewModel());
