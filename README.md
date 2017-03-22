# check-redis-plugin
Nagios/Icinga2 plugin to monitor Redis memory usage using [Webdis](http://webd.is/). 

# Usage
````
node index.js
  -w, --warning=ARG   Warning threshold. The default value is 5
  -c, --critical=ARG  Critical threshold. The default value is 15
  -o, --host=ARG      Webdis host
  -u, --username=ARG  Webdis username
  -p, --password=ARG  Webdis password
  -h, --help          display this help
````
