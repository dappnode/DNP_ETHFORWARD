#!/bin/sh

echo " "
echo " Resolving decentral.eth"
echo " "

RES1=$(curl "http://decentral.eth/")
echo "${RES1}" | awk '/<title>Decentralized/{exit 0} !/<title>Decentralized/{exit 1}' ;
if [ "$?" = "0" ]
then
    echo "Result contains expected string"
else
    echo "Result DOES NOT contain expected string"
    echo "Expected HTML containing <title>Decentralized Portal</title>"
    echo "Received:  ${RES1}"
    exit 1
fi

echo " "
echo " Resolving decentralFake.eth"
echo " "

RES2=$(curl "http://decentralFake.eth/")
echo "${RES2}" | awk '/<title>Decentralized/{exit 0} !/<title>Decentralized/{exit 1}' ;
if [ "$?" = "0" ]
then
    echo "Result contains expected string"
else
    echo "Result DOES NOT contain expected string"
    echo "Expected HTML containing <title>Decentralized Portal</title>"
    echo "Received:  ${RES2}"
    exit 1
fi

# check_domain my.ethchain.dnp.dappnode.eth 172.33.1.6
# check_domain ethchain.dappnode.eth 172.33.1.3
# check_domain ethchain.eth 172.33.1.3
# This one currently fails, should not
# check_domain ethchain.dnp.dappnode.eth 172.33.1.3


