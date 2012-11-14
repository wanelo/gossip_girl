gossip_girl
======

A pluggable [Node.js][node] statsd backend that periodically flushes aggregated data to downstream statsd daemons.

In one way, Gossip Girl is similar to the repeater backend, as it forwards data to another statsd. It differs from repeater in that it doesn't send every packet as it recieves it -- it prefers to wait a configurable amount of ms before doing so. This is particularly useful for aggregating data locally before sending across the network.


Installation and Configuration
------------------------------

 * Either put gossip_girl.js into your statsd backends directory, or "npm install gossip_girl"
 * Add its config parameters to your statsd config file (see exampleGossipConfig.js)
 * Start the statsd daemon:

    node stats.js /path/to/config


Gossip Girl?
---------

Cause she quite agreeably listens to everything you say. But then turns around 
and blabs to anyone who'll listen.

Has nothing to do with the TV show, I swear. No, really.

[wanelo]: http://wanelo.com
[node]: http://nodejs.org


Shout-outs
---------

Initial cut was inspired by the repeater backend by Theo Schlossnagle.

And thanks to the Etsy team for making such a nifty tool: https://github.com/etsy/statsd
