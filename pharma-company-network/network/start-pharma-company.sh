#!/bin/bash

set -ev
# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1
docker-compose -f docker-compose.yml down
docker-compose -f docker-compose.yml up -d ca.kit.com peer1.genome-platform.kit.com couchdb1
export FABRIC_START_TIMEOUT=10
#echo ${FABRIC_START_TIMEOUT}
sleep ${FABRIC_START_TIMEOUT}
# Create the channel
docker exec -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@genome-platform.kit.com/msp" peer1.genome-platform.kit.com peer channel fetch config -o orderer.kit.com:7050 -c data-permission-channel
docker exec -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@genome-platform.kit.com/msp" peer1.genome-platform.kit.com peer channel join -b data-permission-channel_config.block

# Now launch the CLI container
docker-compose -f ./docker-compose.yml up -d cli
docker ps -a