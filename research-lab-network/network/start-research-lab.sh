#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error, print all commands.
set -ev

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

docker-compose -f docker-compose.yml down

docker-compose -f docker-compose.yml up -d ca.kit.com orderer.kit.com peer0.genome-platform.kit.com couchdb
docker ps -a

# wait for Hyperledger Fabric to start
# incase of errors when running later commands, issue export FABRIC_START_TIMEOUT=<larger number>
export FABRIC_START_TIMEOUT=10
#echo ${FABRIC_START_TIMEOUT}
sleep ${FABRIC_START_TIMEOUT}

# Create the channel
docker exec -e "CORE_PEER_LOCALMSPID=GenomePlatformMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@genome-platform.kit.com/msp" peer0.genome-platform.kit.com peer channel create -o orderer.kit.com:7050 -c data-permission-channel -f /etc/hyperledger/configtx/channel.tx
# Join peer0.genome-platform.kit.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=GenomePlatformMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@genome-platform.kit.com/msp" peer0.genome-platform.kit.com peer channel join -b data-permission-channel.block


# Now launch the CLI container
docker-compose -f ./docker-compose.yml up -d cli
docker ps -a

# chaincode
docker exec cli peer chaincode install -n data-app -v 0 -p /opt/gopath/src/github.com/ -l node
sleep 5 # give it some time to install...
docker exec cli peer chaincode instantiate -n data-app -v 0 -l node -c '{"Args":[]}' -C data-permission-channel -P "AND ('GenomePlatformMSP.member')"
sleep 5 # give it some time to instantiate...
docker exec cli peer chaincode invoke -o orderer.kit.com:7050 -C data-permission-channel -n data-app -c '{"function":"initLedger","Args":[]}'