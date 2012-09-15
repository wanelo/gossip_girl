/*
Required Variables:

  backends:         an array of backends to load. 
                    Must include either "./backends/gossip_girl" if the file was copied directly.
                    Or simply include "gossip_girl" if it was installed via npm.
                

  gossip_girl:      an array of hashes of the for host: and port:
                    that details other statsd servers to which the received
                    packets should be sent to.
                    e.g. [ { host: '10.10.10.10', port: 88125 },
                           { host: 'observer', port: 8125 } ]

Optional Variables:

  flushInterval:    interval (in ms) to send data to downstream statsd's

  dumpMessages:     if set to true, will print out a message on each flush


*/
{
  "backends": [
    "./backends/gossip_girl"
  ],
  "gossip_girl": [
    {
      "host": "observer.example.com",
      "port": 8125
    }
  ],
  "flushInterval": 1000,
  "dumpMessages": true 
}
