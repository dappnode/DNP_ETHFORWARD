# Beware in the test docker-compose that travis 
# will do a docker-compose up in a the directory DNPIPFS
# Therefore the name of the network has to be dnpbind_network

# Install bind
##############

mkdir test-build
DAPPNODE_DIR="./test_build"

export BIND_VERSION="0.1.5"
BIND_URL="https://github.com/dappnode/DNP_BIND/releases/download/v${BIND_VERSION}/bind.dnp.dappnode.eth_${BIND_VERSION}.tar.xz"
BIND_YML="https://github.com/dappnode/DNP_BIND/releases/download/v${BIND_VERSION}/docker-compose-bind.yml"
BIND_YML_FILE="${DAPPNODE_DIR}/docker-compose-bind.yml"
BIND_FILE="${DAPPNODE_DIR}/bind.dnp.dappnode.eth_${BIND_VERSION}.tar.xz"

wget -O $BIND_FILE $BIND_URL
wget -O $BIND_YML_FILE $BIND_YML

docker load -i $BIND_FILE

# Delete build line frome yml
sed -i '/build: \.\/build/d' $BIND_YML_FILE

# Start bind
docker-compose -f $BIND_YML_FILE up -d

# Prepare test
##############

cp -r build $DAPPNODE_DIR
cp -r test/* $DAPPNODE_DIR

docker-compose -f ${DAPPNODE_DIR}/docker-compose-ethforward.yml build
docker-compose -f ${DAPPNODE_DIR}/docker-compose-ethforward.yml up -d

sleep 5
docker logs DAppNodeCore-ethforward.dnp.dappnode.eth

docker-compose -f ${DAPPNODE_DIR}/docker-compose-test.yml build
docker network ls
docker-compose -f ${DAPPNODE_DIR}/docker-compose-test.yml run test

docker logs DAppNodeCore-ethforward.dnp.dappnode.eth