var util = require('util'),
    dgram = require('dgram')

function GossipGirl(startupTime, config, emitter) {
  var self = this
  self.config = config.gossip_girl || []
  self.statsd_config = config
  self.ignorable = [ "statsd.packets_received", "statsd.bad_lines_seen", "statsd.packet_process_time", "statsd.timestamp_lag" ]

  emitter.on('flush', function(time_stamp, metrics) { self.process(time_stamp, metrics); })
}

GossipGirl.prototype.gossip = function(packet, host, port) {
  var self = this
  var buffer = new Buffer(packet)
  self.sock.send(buffer, 0, buffer.length, port, host, function(err,bytes) {
    if (err) {
      console.log(err)
    }
  })
}

GossipGirl.prototype.format = function (key, value, suffix) {
  return "'" + key + "':" + value + "|" + suffix + "\n"
}

GossipGirl.prototype.process = function(time_stamp, metrics) {
  var self = this
  hosts = self.config
  var stats, packetTmp, packet = "", countStats = 0, countPacket = 0, countValues = 0

  var stats_map = {
    counters: { data: metrics.counters, suffix: "c", name: "counter" },
    gauges: { data: metrics.gauges, suffix: "g", name: "gauge" },
    timers: { data: metrics.timers, suffix: "ms", name: "timer" }
  }

  self.sock = dgram.createSocket("udp4")
  for (var i = 0; i < hosts.length; i++) {
    for (type in stats_map) {
      stats = stats_map[type]
      for (key in stats.data) {
        if (self.ignorable.indexOf(key) >= 0) continue

        packetTmp = self.format(key, stats.data[key], stats.suffix)

        if (self.statsd_config.dumpMessages) {
          util.log ("Gossiping about " + stats.name + ": " + packet)
        }
        countStats++
        countValues += stats.data[key]
        if (!self.config[i].packageJoin) {
          self.gossip(packetTmp, hosts[i].host, hosts[i].port);
          countPacket++
        } else {
          if (packet.length + packetTmp.length > self.config[i].packageLimit) {
            setTimeout(function(packet, hosts, i){
              self.gossip(packet, hosts[i].host, hosts[i].port)
            }, self.config[i].delay * countPacket, packet, hosts, i);
            packet = packetTmp;
            countPacket++
	  } else {
            packet = packet + packetTmp;
          }
        }
      }
      if (packet.length > 0) {
        setTimeout(function(packet, hosts, i){
          self.gossip(packet, hosts[i].host, hosts[i].port)
        }, self.config[i].delay * countPacket, packet, hosts, i);
        countPacket++
      }
      if (self.config[i].verbose) {
        util.log ("Gossiping " + type + " : " + countStats + "(" + countValues + ") stats in " + countPacket + " packages")
      }
      countPacket = 0
      countStats = 0
      countValues = 0
      packet = ""
    }
  }
}

exports.init = function(startupTime, config, events) {
  var instance = new GossipGirl(startupTime, config, events)
  return true
}
