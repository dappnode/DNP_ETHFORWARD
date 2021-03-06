# DAppNode Package ETHFORWARD (Core)

[![Website dappnode.io](https://img.shields.io/badge/Website-dappnode.io-brightgreen.svg)](https://dappnode.io/)
[![Documentation Wiki](https://img.shields.io/badge/Documentation-Wiki-brightgreen.svg)](https://docs.dappnode.io)
[![GIVETH Campaign](https://img.shields.io/badge/GIVETH-Campaign-1e083c.svg)](https://donate.dappnode.io)
[![RIOT DAppNode](https://img.shields.io/badge/RIOT-DAppNode-blue.svg)](https://riot.dappnode.io)
[![Twitter Follow](https://img.shields.io/twitter/follow/espadrine.svg?style=social&label=Follow)](https://twitter.dappnode.io)

Dappnode package responsible for providing .eth address resolve through ENS

It is an AragonApp whose repo is deployed at this address: [0x294888d97308d7ce3445d83d90268b29282863f7](https://etherscan.io/address/0x294888d97308d7ce3445d83d90268b29282863f7) and whose ENS address is: [ethforward.dnp.dappnode.eth](https://etherscan.io/enslookup?q=ethforward.dnp.dappnode.eth)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- git

  Install [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) commandline tool.

- docker

  Install [docker](https://docs.docker.com/engine/installation). The community edition (docker-ce) will work. In Linux make sure you grant permissions to the current user to use docker by adding current user to docker group, `sudo usermod -aG docker $USER`. Once you update the users group, exit from the current terminal and open a new one to make effect.

- docker-compose

  Install [docker-compose](https://docs.docker.com/compose/install)

**Note**: Make sure you can run `git`, `docker ps`, `docker-compose` without any issue and without sudo command.

### Building

```
$ git clone https://github.com/dappnode/DNP_ETHFORWARD.git
```

```
$ docker-compose build
or
$ docker build --rm -f build/Dockerfile -t ethforward.dnp.dappnode.eth:dev build
```

## Running

### Start

```
$ docker-compose up -d
```

### Stop

```
$ docker-compose down
```

### Status

```
$ docker-compose ps
```

### Logs

```
$ docker-compose logs -f
```

**Note**: In case of having the port 8888 occupied, you should change them in the file docker-compose.yml by other.

## Generating a tar.xz image

[xz](https://tukaani.org/xz/) is required

```
$ docker save ethforward.dnp.dappnode.eth:dev | xz -e9vT0 > ethforward.dnp.dappnode.eth_x.y.z.tar.xz
```

You can download the latest tar.xz version from here [releases](https://github.com/dappnode/DNP_ETHFORWARD/releases).

### Loading a Docker image

```
$docker load -i ethforward.dnp.dappnode.eth_x.y.z.tar.xz
```

## Contributing

Please read [CONTRIBUTING.md](https://github.com/dappnode/DAppNode/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/dappnode/DNP_ETHFORWARD/tags).

## Authors

- **Jordi Baylina** - _Initial work _ - [jbaylina](https://github.com/jbaylina)
- **Eduardo Antuña Díez** - _Dockerize and improvements_ - [eduadiez](https://github.com/eduadiez)

See also the list of [contributors](https://github.com/dappnode/DNP_ETHFORWARD/contributors) who participated in this project.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details

## References

[git](https://git-scm.com/)

[docker](https://www.docker.com/)

[docker-compose](https://docs.docker.com/compose/)

[IPFS](https://ipfs.io/)

[ethforward](https://github.com/jbaylina/ethforward)
