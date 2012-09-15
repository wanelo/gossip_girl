gossip_girl
======

A pluggable [Node.js][node] statsd backend that periodically flushes aggregated data to another statsd daemon.

We ([Wanelo][wanelo]) [blogged][blog post] about how it works and why we created it.


Installation and Configuration
------------------------------

 * Copy gossip_girl.js into your statsd backends directory
 * Add its config parameters to your statsd config file (see exampleConfig.js, below)
 * Start the Daemon:

    node stats.js /path/to/config


Gossip Girl?
---------

Cause she quite agreeably listens to everything you tell her. And then she turns around 
and prattles it all to anyone who'se listening.

[wanelo]: http://wanelo.com
[node]: http://nodejs.org
[blog post]: http://blog.wanelo.com

