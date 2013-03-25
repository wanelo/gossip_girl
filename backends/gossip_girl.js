var util = require('util'),
    dgram = require('dgram')

function GossipGirl(startupTime, config, emitter) {
  var self = this
  self.config = config.gossip_girl || []
  self.statsd_config = config
  self.ignorable = [ "statsd.packets_received", "statsd.bad_lines_seen", "statsd.packet_process_time" ]

  emitter.on('flush', function(time_stamp, metrics) { self.process(time_stamp, metrics); })
}

GossipGirl.prototype.gossip = function(packet, host, port) {
  var self = this
  self.sock.send(packet, 0, packet.length, port, host, function(err,bytes) {
    if (err) {
      console.log(err)
    }
  })
}

GossipGirl.prototype.format = function (key, value, suffix) {
  return new Buffer("'" + key + "':" + value + "|" + suffix)
}

GossipGirl.prototype.process = function(time_stamp, metrics) {
  var self = this
  hosts = self.config
  var stats, packet

  var stats_map = {
    counters: { data: metrics.counters, suffix: "c",  name: "counter" },
    gauges:   { data: metrics.gauges,   suffix: "g",  name: "gauge" },
    timers:   { data: metrics.timers,   suffix: "ms", name: "timer" }
  }

  self.sock = dgram.createSocket("udp4")
  for (var i = 0; i < hosts.length; i++) {
    for (type in stats_map) {
      stats = stats_map[type]
      for (key in stats.data) {
        if (self.ignorable.indexOf(key) >= 0) continue

        if(type == 'timers') {
          metric_data = stats.data[key]
        } else {
          metric_data = [stats.data[key]]
        }
        for(var j = 0; j < metric_data.length; j++) {
          packet = self.format(key, metric_data[j], stats.suffix)
          if (self.statsd_config.dumpMessages) {
            util.log ("Gossiping about " + stats.name + ": " + packet)
          }
          self.gossip(packet, hosts[i].host, hosts[i].port)
        }
      }
    }
  }
}

exports.init = function(startupTime, config, events) {
  var instance = new GossipGirl(startupTime, config, events)
  return true
}
