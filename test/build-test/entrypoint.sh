#!/bin/sh

check_domain()
{
    DOMAIN=$1
    EXPECTED_IP=$2
    IP=$(dig "$DOMAIN" +short)
    if [ "$IP" = "$EXPECTED_IP" ]; then
        echo "resolved $DOMAIN to: $IP"
    else
        echo "Error $DOMAIN resolves to: $IP"
        exit 1
    fi
}

echo " "
echo " Resolving decentral.eth"
echo " "

RES=$(curl "http://decentral.eth/")
echo "${RES}" | awk '/<title>Decentralized Portal</title>/{exit 0} !/<title>Decentralized Portal</title>/{exit 1}' ;
    if [ "$?" = "0" ]
    then
        echo "Result contains expected string"
    else
        echo "Result DOES NOT contain expected string"
        echo "Expected HTML containing <title>Decentralized Portal</title>"
        echo "Received:  ${FILE}"
        exit 1
    fi
fi

echo " "
echo " Resolving decentralFake.eth"
echo " "

RES=$(curl "http://decentralFake.eth/")
echo "${RES}" | awk '/<title>Decentralized Portal</title>/{exit 0} !/<title>Decentralized Portal</title>/{exit 1}' ;
    if [ "$?" = "0" ]
    then
        echo "Result contains expected string"
    else
        echo "Result DOES NOT contain expected string"
        echo "Expected HTML containing <title>Decentralized Portal</title>"
        echo "Received:  ${FILE}"
        exit 1
    fi
fi


# check_domain my.ethchain.dnp.dappnode.eth 172.33.1.6
# check_domain ethchain.dappnode.eth 172.33.1.3
# check_domain ethchain.eth 172.33.1.3
# This one currently fails, should not
# check_domain ethchain.dnp.dappnode.eth 172.33.1.3


