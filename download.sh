#!/bin/bash
# Not sure which one is better. amd64 seem to be more complete
curl http://ftp.debian.org/debian/dists/sid/main/binary-amd64/Packages.gz > data/packages.gz
#curl http://ftp.debian.org/debian/dists/sid/main/binary-all/Packages.gz > data/packages.gz
gunzip ./data/packages.gz
