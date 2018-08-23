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



