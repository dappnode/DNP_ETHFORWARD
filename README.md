# DNP_ETHFORWARD

Dappnode package responsible for providing .eth address resolve through ENS

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

This repository provides the way to run ethforward in standalone mode, using [infura](https://infura.io/) and redirecting through http://ipfs.io.

Due to this it will be able to load pages stored in IPFS in the following way: http://localhost:8888/domain.eth

For example:
```
http://localhost:8888/baylina.eth
```
The version running on a Dappnode connects to the locale services, both ipfs and the ethereum blockchain

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
$ docker build --rm -f build/Dockerfile -t dnp_ethforward:dev build 
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
$ docker save dnp_ethforward:dev | xz -9 > dnp_ethforward.tar.xz
```

You can download the latest tar.xz version from here [releases](https://github.com/dappnode/DNP_ETHFORWARD/releases).

### Loading a Docker image

```
$docker load -i dnp_ethforward.tar.xz
```

## Contributing

Please read [CONTRIBUTING.md](https://github.com/dappnode) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/dappnode/DNP_ETHFORWARD/tags). 

## Authors

* **Eduardo Antuña Díez** - *Initial work* - [eduadiez](https://github.com/eduadiez)

See also the list of [contributors](https://github.com/dappnode/DNP_ETHFORWARD/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## References

[git](https://git-scm.com/)

[docker](https://www.docker.com/)

[docker-compose](https://docs.docker.com/compose/)

[IPFS](https://ipfs.io/)

[infura](https://infura.io/)