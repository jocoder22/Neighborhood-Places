
//make AJAX call to foursquare API
var result = function(){
  var AllPlaces = [];
  var myAddress = '383 Springfield Ave, Newark NJ 07103';
  var foursquareUrl2 = 'https://api.foursquare.com/v2/venues/search?limit=80&near=' + myAddress + '&client_id=RMJLP0XC1CPMPOE4IINGN4RSBFUVTP10D1N0OO0RLBCCNPFK&client_secret=2OAXA5CSE43HQRNUYEEFV2FYR3SLB3CHVN0FCLXEGIUVCUUP&v=20170801';

  $.getJSON(foursquareUrl2, function(data){
    var resultParsed = data.response.venues;
    for (var i = 0; i < resultParsed.length; i++) {
      var resp = resultParsed[i]; var llresp = resp.location;
      if (resp.contact.formattedPhone && resp.name.length <= 16) {
        AllPlaces.push({
          name: resp.name,
          Address: llresp.formattedAddress,
          Phone: resp.contact.formattedPhone,
          stats: resp.stats,
          latlng:[{lat: llresp.lat, lng: llresp.lng}]});
          if(AllPlaces.length == 8){
            return false;
          }
      }
    }
  }).fail(function(xhr, errorType, exception) {
    alert( "Failed to connect to Foursquare API : " + xhr.textstatus + " " + errorType + "\n " + exception);
  });
  return AllPlaces;
}();



var map;
var markers = [];

myresults = [];
setTimeout (function() {
  result.forEach(function(item){
    myresults.push(item);
  });
}, 600);



setTimeout (function() {
  (function initMap() {
    map = new google.maps.Map(document.getElementById('mm'), {
      center: myresults[3].latlng[0],
      zoom: 15
    });
    var bounds = new google.maps.LatLngBounds();
    var infowindowList = new google.maps.InfoWindow();

    for (var i = 0; i < myresults.length; i++) {
      var maklocation = myresults[i].latlng[0];
      var makaddress = myresults[i].Address;
      var maktitle = myresults[i].name;
      var makphone = myresults[i].Phone;
      var makstats = "checkinsCount : " +  myresults[i].stats.checkinsCount + ", " + " tipCount : " + myresults[i].stats.tipCount + ", " + " usersCount : " + myresults[i].stats.usersCount;
      var marker = new google.maps.Marker({
        position: maklocation,
        map: map,
        name: maktitle,
        animation: google.maps.Animation.DROP,
        cursor: '<h4>' + maktitle + '</h4>' + makaddress + '<br>' + makphone + '<br>' + makstats,
        id: i
      });
      markers.push(marker);
      bounds.extend(markers[i].position);
      showInfoWindow(marker, infowindowList);
    }
    map.fitBounds(bounds);

    function showInfoWindow(marker, infowindowList) {
      marker.addListener('click', function(){
        infowindowList.setContent(marker.cursor);
        infowindowList.open(map, marker);
      // });
      // marker.addListener('click', function(){
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {marker.setAnimation(null);}, 1000);
      });
      marker.addListener('mouseout', function(){
        infowindowList.close(map, marker);
      });
    }
  })();
}, 1000);

var ViewModel = function () {
  var self = this;
  self.myPlaces = ko.observableArray([]);
  self.query1 = ko.observable('');

  setTimeout(function() {
    result.forEach(function(item){
      self.myPlaces.push(item);
    });
  }, 600);

  self.filterPlace = ko.computed(function () {
    var myFilter = self.query1().toLowerCase();
    if (!myFilter) {
      return self.myPlaces();
    } else {
      return ko.utils.arrayFilter(self.myPlaces(), function (item) {
        return item.name.toLowerCase().indexOf(myFilter) >=0;
      });
    }
  });
};

ko.applyBindings(new ViewModel());
