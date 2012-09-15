gossip_girl
======

A pluggable [Node.js][node] statsd backend that periodically flushes aggregated data to downstream statsd daemons.

We ([Wanelo][wanelo]) [blogged][blog post] about how it works and why we created it.


Installation and Configuration
------------------------------

 * Copy gossip_girl.js into your statsd backends directory
 * Add its config parameters to your statsd config file (see exampleConfig.js, below)
 * Start the Daemon:

    node stats.js /path/to/config


Gossip Girl?
---------

Cause she quite agreeably listens to everything you say. But then turns around 
and prattles to anyone who'll listen.

[wanelo]: http://wanelo.com
[node]: http://nodejs.org
[blog post]: http://blog.wanelo.com

