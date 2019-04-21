### Hyperledger Fabric Setup on three Hosts
(Adapted from Hyperledger Fabric [fabcar tutorial](https://hyperledger-fabric.readthedocs.io/en/latest/write_first_app.html))
and [this online tutorial](https://medium.com/1950labs/setup-hyperledger-fabric-in-multiple-physical-machines-d8f3710ed9b4)

On every machine, the Hyperledger Fabric binaries need to be downloaded and installed. The easiest way is to download the `fabric-samples`: 

`sudo curl -sSL http://bit.ly/2ysbOFE | bash -s`

The url points to a script which will download the binaries (along with some Hyperledger Fabric samples and tutorial material). It automatically chooses the latest version of Fabric. 

In the generated folder `fabric-samples`, only the \bin directory is needed (however the samples can be run, too). 

In order to run the binaries from any location, run

`export PATH=fabric-samples/bin:$PATH`

For more information on the samples, refer to https://hyperledger-fabric.readthedocs.io/en/release-1.4/install.html

Each of the folders pharma-company-network, hospital-network and research-lab-network is supposed to be deployed on its corresponding machine. 

On each machine, direct into to `network` folder and run

`start--XX.sh` to start the Hyperledger Fabric services in docker containers.
