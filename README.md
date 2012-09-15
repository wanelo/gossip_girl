gossip_girl
======

A pluggable [Node.js][node] statsd backend that periodically flushes aggregated data to downstream statsd daemons.

We ([Wanelo][wanelo]) [blogged][blog post] about how it works and why we created it.


Installation and Configuration
------------------------------

 * Copy gossip_girl.js into your statsd backends directory
 * Add its config parameters to your statsd config file (see exampleGossipConfig.js)
 * Start the Daemon:

    node stats.js /path/to/config


Gossip Girl?
---------

Cause she quite agreeably listens to everything you say. But then turns around 
and prattles to anyone who'll listen.

Has nothing to do with the TV show, I swear. No, really.

[wanelo]: http://wanelo.com
[node]: http://nodejs.org
[blog post]: http://blog.wanelo.com


Shout Outs
---------
This is a shameless ripoff of the repeater statsd backend by Theo Schlossnagle.

And thanks to the Etsy team for making such a nifty tool.
