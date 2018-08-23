# Beware in the test docker-compose that travis 
# will do a docker-compose up in a the directory DNPIPFS
# Therefore the name of the network has to be dnpbind_network

# Install bind
##############

DAPPNODE_DIR="./"

export BIND_VERSION="0.1.5"
BIND_URL="https://github.com/dappnode/DNP_BIND/releases/download/v${BIND_VERSION}/bind.dnp.dappnode.eth_${BIND_VERSION}.tar.xz"
BIND_YML="https://github.com/dappnode/DNP_BIND/releases/download/v${BIND_VERSION}/docker-compose-bind.yml"
BIND_YML_FILE="${DAPPNODE_CORE_DIR}docker-compose-bind.yml"
BIND_FILE="${DAPPNODE_CORE_DIR}bind.dnp.dappnode.eth_${BIND_VERSION}.tar.xz"

wget -O $BIND_FILE $BIND_URL
wget -O $BIND_YML_FILE $BIND_YML

docker load -i $BIND_FILE

# Delete build line frome yml
sed -i '/build: \.\/build/d' $BIND_FILE

# Start bind
cp ${BIND_YML_FILE} test-build
docker-compose -f test-build/${BIND_YML_FILE} up -d

# Prepare test
##############

mkdir test-build
cp -r build test-build
cp -r test/* test-build

docker-compose -f test-build/docker-compose-ethforward.yml build
docker-compose -f test-build/docker-compose-ethforward.yml up -d

sleep 5
docker logs DAppNodeCore-ethforward.dnp.dappnode.eth

docker-compose -f test-build/docker-compose-test.yml build
docker-compose -f test-build/docker-compose-test.yml run test

docker logs DAppNodeCore-ethforward.dnp.dappnode.eth