/* Magic Mirror
 * Module: BoredDaily
 *
 * By CptMeetKat
 * MIT Licensed.
 */

Module.register("NextTrains", {
   // Default module config.

   defaults: {
      boredURL: "https://www.boredapi.com/api/activity",
      updateInterval : 10, //Seconds before changeing
      type: "Welcome to NextTrains!",
      xtext: "Keeping you on top of your trains",
      trains: [],
      targetStation: "",
      numberoftrains: 4
   },

   start: function() {
      this.config.updateInterval = this.config.updateInterval * 1000
      
      this.getActivity();
      setInterval(() => {
         this.getActivity();
      }, this.config.updateInterval);

   },

    getDom: function() {

        if(this.config.trains.length == 0) {
            return document.createElement("div").innerHTML = "Loading Times"
        }

        const wrapper = document.createElement("table");
        const header_row = this.createTableHeader()
        wrapper.appendChild(header_row)

        let row = null
        // console.log(this.config.time_format)
        this.config.trains.forEach(t => {
                row = this.createTableRow( t["stop_name:1"], t.departure_time, t.trip_headsign)
                wrapper.appendChild(row)
        });



        return wrapper;
    },

    getHeader: function() {
        return "NextTrains: " + this.config.targetStation;
    },

    createTableHeader: function() {
        let header_row = document.createElement('tr')
        header_row.className = "align-left regular xsmall dimmed"
        
        let header_destination = document.createElement('td')
        let route_time = document.createElement('td')
        let header_time = document.createElement('td')

        
        header_destination.innerText = "Platform"
        route_time.innerText = "Route"
        header_time.innerText = "Departs"
        
        header_row.appendChild(header_destination)
        header_row.appendChild(route_time)
        header_row.appendChild(header_time)
        return header_row
    },

    createTableRow: function(destination_name, local_time, route_name) {
        let row = document.createElement('tr')
        row.className = "align-left small normal"
        
        let destination = document.createElement('td')
        let route = document.createElement('td')
        let time = document.createElement('td')

        destination.innerText = destination_name.split(' ').pop()
        route.innerText = route_name;
        time.innerText = local_time
        
        // if(this.config.etd) {

        //     let etd = local_time
        //     time.innerText = etd + " mins"
        //     if(etd == 0) {
        //         time.innerText = "now"
        //     }
        // }
        
        row.appendChild(destination)
        row.appendChild(route)
        row.appendChild(time)
        return row

    },

   socketNotificationReceived: function(notification, payload) {
        if (notification === "ACTIVITY") {

            this.config.trains = payload;

            this.updateDom(1000);
        }
    },

    getActivity: function() {
        Log.info("BORED: Getting activity.");

        this.sendSocketNotification("GET_TRAINS", {
            config: this.config
        });
    },

    // Define required styles.
    getStyles: function() {
        return ["nextTrains.css"];
    }

});
