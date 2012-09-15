var util = require('util'),
    dgram = require('dgram')

function GossipGirl(startupTime, config, emitter) {
  var self = this
  self.config = config.gossip_girl || []
  self.statsd_config = config

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
    counters: { suffix: "c",  data: metrics.counters, name: "counter" },
    gauges:   { suffix: "g",  data: metrics.gauges,   name: "gauge" },
    timers:   { suffix: "ms", data: metrics.timers,   name: "timer" }
  }

  self.sock = dgram.createSocket('udp4')
  for (var i = 0; i < hosts.length; i++) {
    for (type in stats_map) {
      stats = stats_map[type]
      for (key in stats.data) {

        if (stats.data[key] == "statsd.packets_received")  continue
        if (stats.data[key] == "statsd.bad_lines_seen")    continue
        if (stats.data[key] == "statsd.packet_process_time") continue

        packet = self.format(key, stats.data[key], stats.suffix)

        if (self.statsd_config.dumpMessages) {
          util.log ("Gossiping " + stats.name + ": " + packet)
        }

        self.gossip(packet, hosts[i].host, hosts[i].port)
      } 
    }
  }
}

exports.init = function(startupTime, config, events) {
  var instance = new GossipGirl(startupTime, config, events)
  return true
}
